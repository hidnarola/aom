import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardLayoutComponent } from './dashboard-layout/layout/dashboard-layout.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from './dashboard-layout/layout.module';
import { RegisterModule } from './register/register.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    RegisterModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([

      // { 
      //   path: '', 
      //   component: DashboardLayoutComponent,
      //   children: [
      //     { 
      //       path: '', 
      //       loadChildren: './dashboard-layout/dashboard/dashboard.module#DashboardModule', 
      //     }]
      // },
      // { 
      //   path: 'login', 
      //   loadChildren: './login/login.module#LoginModule',
      // }
    ], { useHash: false })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
