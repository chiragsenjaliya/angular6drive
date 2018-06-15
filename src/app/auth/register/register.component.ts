import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AlertService } from "../../shared/services/alert.service";
import { ValidationService } from "../../shared/services/validation.service";
import { AuthenticationService} from "../auth.service";
import { NgProgress, NgProgressRef } from "@ngx-progressbar/core";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
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
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hidepass = true;
  hideconfirm = true;
  progressRef: NgProgressRef;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public ValidationService: ValidationService,
    public AuthenticationService: AuthenticationService,
    public router: Router,
    public ngProgress: NgProgress
  ) {}

  ngOnInit() {
    this.progressRef = this.ngProgress.ref("ng-progrss");
    this.registerForm = this.formBuilder.group({
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      email: ["", [Validators.required, ValidationService.emailValidator]],
      company_name: ["", [Validators.required]],
      password: [
        "",
        [Validators.required, ValidationService.passwordValidator]
      ],
      confirm_password: [
        "",
        [Validators.required, ValidationService.matchValidator("password")]
      ]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onregister() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.progressRef.start();
    this.loading = true;

    this.AuthenticationService.register(this.f)
      .pipe(first())
      .subscribe(
        data => {
          this.progressRef.complete();
          this.alertService.successMessage("User Created Successfully", true);
          this.router.navigate(["/login"]);
          
        },
        error => {           
          this.progressRef.complete();
          this.loading = false;
        }
      );
  }
}
