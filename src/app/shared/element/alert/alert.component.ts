import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => setTimeout(() => {
      if (message) {
        this.snackBar.open(message.text, "Ok", { duration: 4000 });
      }
    }, 0) );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
