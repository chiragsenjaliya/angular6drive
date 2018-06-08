import { Component } from '@angular/core';
import { LoadingBarService } from "@ngx-loading-bar/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(public loader: LoadingBarService) { }
}
