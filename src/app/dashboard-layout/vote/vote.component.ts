import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: []
})
export class VoteComponent implements OnInit {
  show_filter : boolean = false;
  constructor() {}

  ngOnInit() {
  }

  toggleFilter() {
    this.show_filter = !this.show_filter;
  }
  
}
