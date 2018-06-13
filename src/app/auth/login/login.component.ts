import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "../../shared/services/alert.service";
import { first } from "rxjs/operators";
import { ValidationService } from "../../shared/services/validation.service";
import { AuthenticationService } from "../auth.service";
import { Router } from "@angular/router";
import { NgProgress, NgProgressRef } from "@ngx-progressbar/core";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [
    trigger("fadeInOut", [
      state("in", style({ opacity: 0 })),
      transition(":leave", [
        style({ opacity: 1 }),
        animate(300, style({ opacity: 0 }))
      ]),
      transition(":enter", [
        style({ opacity: 0 }),
        animate(5, style({ opacity: 1 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  progressRef: NgProgressRef;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public ValidationService: ValidationService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public ngProgress: NgProgress
  ) {}

  ngOnInit() {
    this.progressRef = this.ngProgress.ref("ng-progrss");
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, ValidationService.emailValidator]],
      password: ["", [Validators.required, ValidationService.passwordValidator]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onLogin() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.progressRef.start();
    this.loading = true;
    this.authenticationService
      .login(this.f)
      .pipe(first())
      .subscribe(
        data => {
          this.progressRef.complete();
          this.router.navigate(["/drive"]);
        },
        error => {
          this.progressRef.complete();
          //this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
