import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login.component';
import {RouterLinkActive} from "@angular/router";
import { LoginService } from 'src/app/services/login.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLinkActive,
  ],
  exports: [LoginComponent],
  providers: [LoginService]
})
export class LoginModule {
}
