import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user.service.service';

@Injectable({
  providedIn: 'root'
})
export class MobileNumberGuard implements CanActivate {

  constructor(private router: Router, private userService: UserServiceService) {}

  canActivate(): boolean {
    // Check if the mobile number is provided
    const mobileNumber = this.userService.getUserDetailsForm().value.number;

    if (mobileNumber && mobileNumber.trim() !== '') {
      // Allow routing to otp_verify page
      return true;
    } else {
      // Redirect to user_details page if mobile number is not provided
      this.router.navigate(['/user_details']);
      return false;
    }
  }
}
