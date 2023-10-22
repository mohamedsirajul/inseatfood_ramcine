import { Component } from '@angular/core';
// import firebase from 'firebase/app';
import 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Update the import statement
import 'firebase/firestore';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent {

  otp!: string;
  verify: any;
  constructor( private router: Router,
    private spinnerService: SpinnerService // Inject the SpinnerService here
    ) { }

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '40px',
      height: '40px',
    },
  };

  ngOnInit() {
    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
    console.log(this.verify);
  }

  onOtpChange(otpCode: any) {
    this.otp = otpCode;
    console.log(this.otp);
    // console.log(this.verify);

  }
  

  handleClick() {
    this.spinnerService.showSpinner();
    console.log(this.otp);
    var credential = firebase.auth.PhoneAuthProvider.credential(
      this.verify,      
      this.otp
    );

    firebase
      .auth()
      .signInWithCredential(credential)
      .then((response) => {
        console.log(response);
        localStorage.setItem('user_data', JSON.stringify(response));
        // Set the flag to indicate successful OTP verification
        localStorage.setItem('isOtpVerified', 'true');
        this.spinnerService.hideSpinner();
        this.router.navigate(['/movie_details']);
      })
      .catch((error) => {
        this.spinnerService.hideSpinner();
        alert(error.message);
      });
  }

}
