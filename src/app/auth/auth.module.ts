import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import { AuthenticationService } from "./auth.service"; 
import {
  LocalizationModule
} from "angular-l10n";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    LocalizationModule,
  ],
  declarations: [LoginComponent, RegisterComponent, AuthComponent]
})
export class AuthenticationModule {}
