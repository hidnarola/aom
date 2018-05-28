import { Component, OnInit, Directive, forwardRef, Attribute } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { RegisterService } from './register.service';
import { environment } from '../../environments/environment';
declare const gapi: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent implements OnInit {
  public artist_cnt : any = 0;
  public listner_cnt : any = 0;
  public step_flag : boolean = true;
  public auth2: any;
  public artist_data : any = {
    'music_type' : [],
    'share_url' : {
      'facebook' : '',
      'instagram' : '',
      'twitter' : '',
      'youtube' : '',
      'sound_cloud' : ''
    }
  };
  public user_data : any = {};
  public location : any = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperReady = false;
  
  artist_step1 : FormGroup;
  artist_step2 : FormGroup;
  passwordFormGroup: FormGroup;
  artist_step3 : FormGroup;
  artist_step4 : FormGroup;

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.GOOGLE_CLIENT_ID,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }
  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE

      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  constructor(private fb: FormBuilder, private RegisterService : RegisterService) {
    this.artist_cnt = 0;
    this.listner_cnt = 0;
    this.artist_step1 = this.fb.group({
      terms_condtion : ['', Validators.required]
    });
    this.passwordFormGroup = this.fb.group({
      password: ['', Validators.minLength(6)],
      conf: ['',  Validators.minLength(6)]
    }, {
      validator : this.passwordMatchValidator
    });
    this.artist_step2 = this.fb.group({
      'email' : ['', [Validators.required, Validators.email]],
      passwordFormGroup : this.passwordFormGroup
    });
    this.artist_step3 = this.fb.group({
      fname : ['', [Validators.required]],
      lname : ['', [Validators.required]],
      gender : []
    });
    this.artist_step4 = this.fb.group({
      zipcode : ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
   }

  ngOnInit() {
    this.googleInit();
  }

  passwordMatchValidator(g: FormGroup) {
      return g.get('password').value === g.get('conf').value ? null : g.get('conf').setErrors({'mismatch': true});
  }
  // get location details based on zipcode
  getLocation() {
    if(this.artist_data['zipcode']) {
      this.RegisterService.getLocationFromZipCode(this.artist_data['zipcode']).subscribe(response => {
        const res =  JSON.parse(response['_body']);
        if(res['results'].length > 0 && res['results'][0].hasOwnProperty('address_components')) {
          if(res['results'][0]['address_components'].length > 3) {
            this.location = res['results'][0]['address_components'][1]['long_name']+', '+res['results'][0]['address_components'][3]['long_name']
          } else if (res['results'][0]['address_components'].length > 2) {
            this.location = res['results'][0]['address_components'][1]['long_name']+', '+res['results'][0]['address_components'][2]['long_name']
          }
        } else {
          this.location = '';
        }
      });
    } else {
      this.location = '';
    }
  }

  // manage music type selection
  onChange(type:string, isChecked: boolean) {  
    if(isChecked) {
      this.artist_data.music_type.push(type);
    } else {
      let index = this.artist_data.music_type.findIndex(x => x == type)
      this.artist_data.music_type.splice(index, 1);
    }
  }

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
      this.croppedImage = image;
  }
  imageLoaded() {
    this.cropperReady = true;
  }
  imageLoadFailed () {
    console.log('Load failed');
  }
  // Handle submit event of artist form
  artist_submit() {
    console.log('Fianl data', this.artist_data);
  }

  public nxt_btn(step_lbl) {
    console.log(this.artist_step1);
    this.step_flag = false;
    console.log(step_lbl, this.artist_cnt);
    if(step_lbl == 'artist') {
      this.artist_cnt++;
    } else {
      this.listner_cnt++;
    }
  }

  public back_btn(step_lbl) {
    if(step_lbl == 'artist') {
      this.artist_cnt--;
      if(this.artist_cnt == 0)
        this.step_flag = true;
    } else {
      this.listner_cnt--;
      if(this.listner_cnt == 0)
        this.step_flag = true;
    }
    
  }
}