import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user.service.service';

@Injectable({
  providedIn: 'root'
})
export class OtpVerifiedGuard implements CanActivate {

  constructor(private router: Router, private userService: UserServiceService) {}

  canActivate(): boolean {
    // Check if OTP is successfully verified
    const otpVerified = this.userService.isOtpVerified();

    if (otpVerified) {
      // Allow routing to other pages if OTP is verified
      return true;
    } else {
      // Redirect back to the movie_details page if OTP is not verified
      this.router.navigate(['/movie_details']);
      return false;
    }
  }
}
