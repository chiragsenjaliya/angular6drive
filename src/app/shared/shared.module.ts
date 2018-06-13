import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { AlertComponent } from './element/alert/alert.component';
import { AlertService } from "./services/alert.service";
import { ValidationService } from "./services/validation.service";
import { ControlMessages } from "./element/control-message/control-message.component";
import { TokenStorage } from "./services/token-storage.service";
import { RouterModule } from "@angular/router";
import { NgProgressModule } from "@ngx-progressbar/core";
import { NgProgressRouterModule } from "@ngx-progressbar/router";
import { CreateFolderDialogComponent } from './element/create-folder-dialog/create-folder-dialog.component';
import { ProcessLoaderDialogComponent } from "./element/process-loader-dialog/process-loader-dialog.component";
import { FlexLayoutModule } from "@angular/flex-layout";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    RouterModule,
    NgProgressModule.forRoot(),
    NgProgressRouterModule,
    FlexLayoutModule
  ],
  declarations: [
    AlertComponent,
    ControlMessages,
    CreateFolderDialogComponent,
    ProcessLoaderDialogComponent
  ],
  entryComponents: [CreateFolderDialogComponent, ProcessLoaderDialogComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AlertComponent,
    ControlMessages,
    RouterModule,
    NgProgressModule,
    NgProgressRouterModule,
    FlexLayoutModule
  ],
  providers: [
    AlertService,
    ValidationService,
    TokenStorage,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class SharedModule {}