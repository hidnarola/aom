import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { WhatsNewComponent } from './whatsnew/whatsnew.component';
import { DashboardLayoutModule } from './layout/dashboard-layout.module';
import { CarouselModule } from '../shared/carousel/carousel.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardLayoutModule,
    CarouselModule,
    RouterModule.forChild([
      {
        path: '',
        component:DashboardLayoutComponent, 
        children: [
          {path: '', component: DashboardComponent},
          {path: 'whats-new', component: WhatsNewComponent}

        ]
      }
    ])
  ],
  declarations: [DashboardComponent, WhatsNewComponent]
})
export class LayoutModule { }
