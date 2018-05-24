import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'register', component: RegisterComponent }
    ])
  ],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
