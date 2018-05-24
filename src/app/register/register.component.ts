import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent implements OnInit {
  public artist_cnt : any = 0;
  public listner_cnt : any = 0;
  public step_flag : boolean = true;

  constructor() {
    this.artist_cnt = 0;
    this.listner_cnt = 0;
   }

  ngOnInit() {
  }

  public nxt_btn(step_lbl) {
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
