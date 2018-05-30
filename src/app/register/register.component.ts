import { Component, OnInit, Directive, forwardRef, Attribute } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  public music_types : any = [];
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
  public listener_data : any = {
    'music_type' : []
  };
  public user_data : any = {};
  public location : any = '';
  public day : any = [];
  public month : any = [];
  public year : any = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperReady = false;
  
  // Artist From Group for validation
  artist_step1 : FormGroup;
  artist_step2 : FormGroup;
  passwordFormGroup: FormGroup;
  passwordFormGroup1: FormGroup;
  artist_step3 : FormGroup;
  artist_step4 : FormGroup;

  // Listener Form Group for validation
  listener_step1 : FormGroup;
  listener_step2 : FormGroup;
  listener_step3 : FormGroup;
  listener_step4 : FormGroup;

  constructor(private fb: FormBuilder, private RegisterService : RegisterService, private toastr: ToastrService) {
    this.artist_cnt = 0;
    this.listner_cnt = 0;
    this.day = [];
    this.month = [];
    this.year = [];
    for(let i = 1; i<= 31; i++ ) {
      this.day.push(i);
    }
    for(let i = 1; i<= 12; i++ ) {
      this.month.push(i);
    }
    for(let i = 1900; i<= (new Date()).getFullYear(); i++ ) {
      this.year.push(i);
    }
    this.artist_step1 = this.fb.group({
      terms_condtion : ['', Validators.required]
    });
    this.passwordFormGroup1 = this.fb.group({
      artist_password: ['', Validators.minLength(6)],
      artist_conf: ['',  Validators.minLength(6)]
    }, {
      validator : this.passwordMatchValidator
    });
    this.passwordFormGroup = this.fb.group({
      password: ['', Validators.minLength(6)],
      conf: ['',  Validators.minLength(6)]
    }, {
      validator : this.passwordMatchValidatorListener
    });
    this.artist_step2 = this.fb.group({
      'email' : ['', [Validators.required, Validators.email]],
      passwordFormGroup1 : this.passwordFormGroup1
    });
    this.artist_step3 = this.fb.group({
      fname : ['', [Validators.required]],
      lname : ['', [Validators.required]],
      gender : []
    });
    this.artist_step4 = this.fb.group({
      zipcode : ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    this.listener_step1 = this.fb.group({
      email : ['', [Validators.required, Validators.email]],
      passwordFormGroup : this.passwordFormGroup
    });

    this.listener_step2 = this.fb.group({
      terms_condtion : ['', Validators.required]
    });

    this.listener_step3 = this.fb.group({
      fname : ['', [Validators.required]],
      lname : ['', [Validators.required]],
      day : ['', [Validators.required]],
      month : ['', [Validators.required]],
      year : ['', [Validators.required]]
    });

    this.listener_step4 = this.fb.group({
      zipcode : ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    this.RegisterService.getAllMusicType().subscribe(response => {
      this.music_types = response['music'];
    });
   }
  
  // Code for initialize google login button
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

  // Code for open google signin popup and do login
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

  ngOnInit() {
    this.googleInit();
    
  }

  passwordMatchValidator(g: FormGroup) {
      return g.get('artist_password').value === g.get('artist_conf').value ? null : g.get('artist_conf').setErrors({'mismatch': true});
  }

  passwordMatchValidatorListener(g: FormGroup) {
      return g.get('password').value === g.get('conf').value ? null : g.get('conf').setErrors({'mismatch': true});
  }
  // get location details based on zipcode
  getLocation() {
    if(this.artist_data['zipcode']) {
      this.RegisterService.getLocationFromZipCode(this.artist_data['zipcode']).subscribe(response => {
        const res =  response;
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
  // get location details based on zipcode for listener
  getLocationForListener() {
    if(this.listener_data['zipcode']) {
      this.RegisterService.getLocationFromZipCode(this.listener_data['zipcode']).subscribe(response => {
        const res = response;
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

  // manage music type selection for artist
  onChange(type:string, isChecked: boolean) {  
    if(isChecked) {
      this.artist_data.music_type.push(type);
    } else {
      let index = this.artist_data.music_type.findIndex(x => x == type)
      this.artist_data.music_type.splice(index, 1);
    }
  }

  // manage music type selection for artist
  onChangeForListener(type:string, isChecked: boolean) {  
    if(isChecked) {
      this.listener_data.music_type.push(type);
    } else {
      let index = this.listener_data.music_type.findIndex(x => x == type)
      this.listener_data.music_type.splice(index, 1);
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
    let data = {
      email : this.artist_data['email'],
      password : this.artist_data['password'],
      first_name : this.artist_data['fname'],
      last_name : this.artist_data['lname'],
      zipcode : this.artist_data['zipcode'],
      gender : this.artist_data['gender'],
      music_type : this.artist_data['music_type'],
      image : this.croppedImage
    };
    console.log('artist', data);
    this.RegisterService.artistRegistration(data).subscribe(response => {
      console.log('response', response);
      this.step_flag = true;
      this.artist_cnt = 0;
      this.artist_data = {
        'music_type' : [],
        'share_url' : {
          'facebook' : '',
          'instagram' : '',
          'twitter' : '',
          'youtube' : '',
          'sound_cloud' : ''
        }
      };
      this.toastr.success('Success!', 'Registration done successfully and confirmation email sent to your account please verify to to do login.');
    });
  }
  // Handle submit event of listener form
  listener_submit() {
    let data = {
      email : this.listener_data['email'],
      password : this.listener_data['password'],
      first_name : this.listener_data['fname'],
      last_name : this.listener_data['lname'],
      zipcode : this.listener_data['zipcode'],
      music_type : this.listener_data['music_type']
    };
    console.log('listener', data);
    this.RegisterService.listenerRegistration(data).subscribe(response => {
      console.log('response', response);
      this.step_flag = true;
      this.listner_cnt = 0;
      this.listener_data = {
        'music_type' : []
      };
      this.toastr.success('Success!', 'Registration done successfully and confirmation email sent to your account please verify to to do login.');
    });
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