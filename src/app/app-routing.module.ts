import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./auth/auth.module#AuthenticationModule",
  },
  {
    path: "drive",
    loadChildren: "./drive/drive.module#DriveModule",
    canActivate: [ProtectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
