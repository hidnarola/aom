import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent implements OnInit {
  public artist_cnt : any = 0;
  public listner_cnt : any = 0;
  public step_flag : boolean = true;
  public artist_data : any = {};
  public user_data : any = {};
  
  artist_step1 : FormGroup;
  artist_step2 : FormGroup;

  constructor(private fb: FormBuilder) {
    this.artist_cnt = 0;
    this.listner_cnt = 0;
    this.artist_step1 = this.fb.group({
      terms_condtion : ['', Validators.required]
    });

    this.artist_step2 = this.fb.group({
      email : ['', Validators.required, Validators.pattern('^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$')],
      password : ['', [Validators.required, Validators.minLength(6)]],
      conf: ['', Validators.required]
    });
   }

  ngOnInit() {
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
