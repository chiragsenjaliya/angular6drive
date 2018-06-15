import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrivespaceComponent } from "./component/drivespace/drivespace.component";
import { DriveComponent } from "./drive.component";

const routes: Routes = [
  {
    path: "folder",
    component: DriveComponent,
    children: [
      { path: ":id", component: DrivespaceComponent },
      { path: "", component: DrivespaceComponent }
    ]
  },
  { path: "", redirectTo: "/drive/folder" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriveRoutingModule { }
