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
import { CreateFolderDialogComponent } from "./dialog/create-folder-dialog/create-folder-dialog.component";
import { ProcessLoaderDialogComponent } from "./dialog/process-loader-dialog/process-loader-dialog.component";
import { UploaddialogComponent } from "./dialog/uploaddialog/uploaddialog.component";
import { FolderfilecardComponent } from './component/folderfilecard/folderfilecard.component';
import { EcoFabSpeedDialModule} from "@ecodev/fab-speed-dial";
import { PreviewComponent } from './dialog/preview/preview.component';
import { ImageViewerModule } from "@hallysonh/ngx-imageviewer";
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
@NgModule({
  imports: [
    CommonModule,
    DriveRoutingModule,
    LocalizationModule,
    SharedModule,
    AngularSplitModule.forRoot(),
    EcoFabSpeedDialModule,
    TreeModule,
    ImageViewerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  declarations: [
    DriveComponent,
    DrivespaceComponent,
    DrivetreeComponent,
    CreateFolderDialogComponent,
    ProcessLoaderDialogComponent,
    UploaddialogComponent,
    FolderfilecardComponent,
    PreviewComponent
  ],
  entryComponents: [
    CreateFolderDialogComponent,
    ProcessLoaderDialogComponent,
    UploaddialogComponent,
    PreviewComponent
  ],
  bootstrap: [PreviewComponent]
})
export class DriveModule {}
