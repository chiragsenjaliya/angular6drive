import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveRoutingModule } from './drive-routing.module';
import { DriveComponent } from './drive.component';
import { SharedModule } from "../shared/shared.module";
import { LocalizationModule } from "angular-l10n";
import { DrivespaceComponent } from './component/drivespace/drivespace.component';
import { DrivetreeComponent} from './component/drivetree/drivetree.component';
import { AngularSplitModule } from "angular-split-ng6";
import { TreeModule } from "angular-tree-component";

@NgModule({
  imports: [
    CommonModule,
    DriveRoutingModule,
    LocalizationModule,
    SharedModule,
    AngularSplitModule.forRoot(),
    TreeModule
  ],
  declarations: [
    DriveComponent,
    DrivespaceComponent,
    DrivetreeComponent
  ]
})
export class DriveModule {}
