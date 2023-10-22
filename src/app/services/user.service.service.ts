import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  userDetailsForm: FormGroup | any;

  constructor() {}

  setUserDetailsForm(form: FormGroup) {
    this.userDetailsForm = form;
  }

  getUserDetailsForm() {
    return this.userDetailsForm;
  }

  private otpVerified: boolean = false;

  // Method to set the OTP verification status
  setOtpVerified(verified: boolean) {
    this.otpVerified = verified;
  }

  // Method to check if OTP is verified
  isOtpVerified(): boolean {
    return this.otpVerified;
  }
}
