import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class ErrorHandler {
    constructor(public snackbar: MatSnackBar) { }

    public handleError(err: any) {

        if (err.status == 404) {
            this.snackbar.open("No resource found please try again later!", "close");
        }

        if (err.status == 500 || err.status == 405) {
            this.snackbar.open("Bad Request try again later!", "close");
        }

        if (err.status == 401 || err.status == 403) {
            this.snackbar.open("Login again !", "close");
        }

        if (err.status == 0) {
            this.snackbar.open("Unknown error try again later!!", "close");
        }

    }
}
