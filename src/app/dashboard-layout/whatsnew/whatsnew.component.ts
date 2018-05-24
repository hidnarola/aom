import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whatsnew',
  templateUrl: './whatsnew.component.html',
  styleUrls: []
})
export class WhatsNewComponent implements OnInit {
  
  images: any = [];
  constructor() {
    this.images =  [
      {
        "source": "img/whats-new-bg.png",
        "alt": "Description for Image 1",
        "title": "Title 1",
        "name": "Title 1",
        "location": "Title 1",
        "type": "Title 1",
        "enable": true
      },
      {
        "source": "img/whats-new-bg.png",
        "alt": "Description for Image 2",
        "title": "Title 2",
        "name": "Title 1",
        "location": "Title 1",
        "type": "Title 1",
        "enable": true
      },
      {
        "source": "img/whats-new-bg.png",
        "alt": "Description for Image 3",
        "title": "Title 3",
        "name": "Title 1",
        "location": "Title 1",
        "type": "Title 1",
        "enable": true
      }];
   }

  ngOnInit() {
  }

  
}
