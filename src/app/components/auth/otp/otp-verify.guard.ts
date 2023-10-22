import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OtpVerifyGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if OTP is verified (you can implement your own logic here)
    const isOtpVerified = localStorage.getItem('isOtpVerified') === 'true';

    if (isOtpVerified) {
      // Allow routing to movie_details page
      return true;
    } else {
      // Redirect to user-details page if OTP is not verified
      this.router.navigate(['/user_details']);
      return false;
    }
  }
}
