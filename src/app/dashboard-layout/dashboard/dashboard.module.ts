import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component'


@NgModule({
  imports: [
    CommonModule,
    // RouterModule.forChild([
    //   { path: '', component: DashboardComponent, data: { title: 'Dashboard' } }
    // ])
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
