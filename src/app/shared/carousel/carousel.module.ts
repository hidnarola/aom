import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    NgxCarouselModule
  ],
  declarations: [CarouselComponent],
  exports: [CarouselComponent]
})
export class CarouselModule {

}
