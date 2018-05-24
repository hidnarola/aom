import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  images: any = [];
  constructor() { }

  ngOnInit() {
    this.images =  [
        {
          "source": "img/finalist1.png",
          "alt": "Description for Image 1",
          "title": "Title 1",
          "name": "Title 1",
          "location": "Title 1",
          "type": "Title 1",
          "enable": true
        },
        {
          "source": "img/finalist2.png",
          "alt": "Description for Image 2",
          "title": "Title 2",
          "name": "Title 1",
          "location": "Title 1",
          "type": "Title 1",
          "enable": true
        },
        {
          "source": "img/finalist3.png",
          "alt": "Description for Image 3",
          "title": "Title 3",
          "name": "Title 1",
          "location": "Title 1",
          "type": "Title 1",
          "enable": true
        },
        {
          "source": "img/finalist4.png",
          "alt": "Description for Image 4",
          "title": "Title 4",
          "name": "Title 1",
          "location": "Title 1",
          "type": "Title 1",
          "enable": true
        },
        {
          "source": "img/finalist1.png",
          "alt": "Description for Image 5",
          "title": "Title 5",
          "name": "Title 1",
          "location": "Title 1",
          "type": "Title 1",
          "enable": true
        },
        {
          "source": "img/finalist2.png",
          "alt": "Description for Image 6",
          "title": "Title 6",
          "name": "Title 1",
          "location": "Title 1",
          "type": "Title 1",
          "enable": true
        },
        {
          "source": "img/finalist3.png",
          "alt": "Description for Image 7",
          "title": "Title 7",
          "name": "Title 1",
          "location": "Title 1",
          "type": "Title 1",
          "enable": true
        },
        {
          "source": "img/finalist4.png",
          "alt": "Description for Image 8",
          "title": "Title 8",
          "name": "Title 1",
          "location": "Title 1",
          "type": "Title 1",
          "enable": true
        }
      ];
  }

  onChange(index: any) {
    console.log(this.images[index]);
    if (this.images[index]['enable']) {
      this.images[index]['enable'] = false;
    } else {
      this.images[index]['enable'] = true;
    }
  }
  
}
