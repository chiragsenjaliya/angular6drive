import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Injectable({
  providedIn: "root"
})
export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      required: "This is required",
      invalidEmailAddress: "Invalid email address",
      invalidPassword:
        "Invalid password. Password must be at least 6 characters long, and contain a number.",
      invalidConfirmPassword:"Password Confirm Password doesn't match",
      minlength: `Minimum length ${validatorValue.requiredLength}`
    };

    return config[validatorName];
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  static matchValidator(fieldName: string) {
    let fcfirst: FormControl;
    let fcSecond: FormControl;

    return function matchValidator(control: FormControl) {

      if (!control.parent) {
        return null;
      }

      // INITIALIZING THE VALIDATOR.
      if (!fcfirst) {
        //INITIALIZING FormControl first
        fcfirst = control;
        fcSecond = control.parent.get(fieldName) as FormControl;

        //FormControl Second
        if (!fcSecond) {
          throw new Error('matchValidator(): Second control is not found in the parent group!');
        }

        fcSecond.valueChanges.subscribe(() => {
          fcfirst.updateValueAndValidity();
        });
      }

      if (!fcSecond) {
        return null;
      }

      if (fcSecond.value !== fcfirst.value) {
        return { invalidConfirmPassword: true };
      }

      return null;
    }
  
  }

}

