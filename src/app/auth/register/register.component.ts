import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AlertService } from "../../shared/services/alert.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ValidationService } from "../../shared/services/validation.service";
import { AuthenticationService} from "../auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hidepass = true;
  hideconfirm = true;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public loader: LoadingBarService,
    public ValidationService: ValidationService,
    public AuthenticationService: AuthenticationService,
    public router: Router
  ) {}

  ngOnInit() {
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

    this.loading = true;

    this.AuthenticationService.register(this.f)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(["/login"]);
          this.alertService.error("User Created Successfully");
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
