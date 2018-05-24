import { Component, OnInit, Input } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  moduleId: module.id,
  selector: 'app-carousel-scroll',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() images: any[];
  @Input() showFavourit: boolean;
  @Input() carouselType : any;
  public carouselOne: NgxCarousel;
  constructor() {
  }
  onChange(index: any) {
    if (this.images[index]['enable']) {
      this.images[index]['enable'] = false;
    } else {
      this.images[index]['enable'] = true;
    }
  }
  ngOnInit() {
    if(this.carouselType == 'normal') {
      this.carouselOne = {
        grid: { xs: 1, sm: 12, md: 3, lg: 4, all: 0 },
        slide: 1,
        speed: 400,
        interval: 2000,
        load: 2,
        touch: true,
        loop: true,
        custom: 'banner',
        point: {
          visible: true
        },
      };
    } else {
      this.carouselOne = {
        grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
        slide: 1,
        speed: 400,
        interval: 2000,
        load: 2,
        touch: true,
        loop: true,
        custom: 'banner',
        point: {
          visible: true
        },
      };
    }
  }
}
