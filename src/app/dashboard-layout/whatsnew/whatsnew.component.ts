import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whatsnew',
  templateUrl: './whatsnew.component.html',
  styleUrls: []
})
export class WhatsNewComponent implements OnInit {
  
  images: any = [];
  show_filter : any = false;
  constructor() {
    this.images =  [
      {
        "source": "img/whats-new-bg.png",
        "alt": "Description for Image 1",
        "title": "Quarter Final",
        "name": "Title 1",
        "location": "Title 1",
        "type": "Title 1",
        "description" : "Ut enim ad minim veniam",
        "enable": true
      },
      {
        "source": "img/whats-new-bg.png",
        "alt": "Description for Image 2",
        "title": "Quarter Final",
        "name": "Title 1",
        "location": "Title 1",
        "type": "Title 1",
        "description" : "Ut enim ad minim veniam",
        "enable": true
      },
      {
        "source": "img/whats-new-bg.png",
        "alt": "Description for Image 3",
        "title": "Quarter Final",
        "name": "Title 1",
        "location": "Title 1",
        "type": "Title 1",
        "description" : "Ut enim ad minim veniam",
        "enable": true
      }];
   }

  ngOnInit() {
  }

  toggleFilter() {
    this.show_filter = !this.show_filter;
  }
  
}
