import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveRoutingModule } from './drive-routing.module';
import { DriveComponent } from './drive.component';
import { SharedModule } from "../shared/shared.module";
import { LocalizationModule } from "angular-l10n";
import { DrivespaceComponent } from './component/drivespace/drivespace.component';

@NgModule({
  imports: [
    CommonModule,
    DriveRoutingModule,
    LocalizationModule,
    SharedModule
  ],
  declarations: [DriveComponent, DrivespaceComponent]
})
export class DriveModule { }
