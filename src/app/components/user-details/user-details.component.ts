import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 
import 'firebase/firestore';
import { UserServiceService } from 'src/app/services/user.service.service';
import { SpinnerService } from 'src/app/services/spinner.service';

var config = {
  apiKey: "AIzaSyBAWvECNptzshibOawhEX5b0K36tM9REGA",
  authDomain: "inseatfood-auth.firebaseapp.com",
  projectId: "inseatfood-auth",
  storageBucket: "inseatfood-auth.appspot.com",
  messagingSenderId: "337089721925",
  appId: "1:337089721925:web:4299653759e4ea7524552c",
  measurementId: "G-YS7MJ2MG7J"
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  userDetailsForm: FormGroup;
  reCaptchaVerifier: any;

  constructor(
     private formBuilder: FormBuilder,
     private router: Router , 
     private order_details: OrderServiceService,
     private userService: UserServiceService, // Inject the UserService here
     private spinnerService: SpinnerService // Inject the SpinnerService here

      ){
    this.userDetailsForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      number: ['', [Validators.required, Validators.maxLength(12), Validators.pattern('^[0-9]{10}$')]]
    })
    this.userService.setUserDetailsForm(this.userDetailsForm);

  }


  get name() {
    return this.userDetailsForm.get('name');
  }

  get number() {
    return this.userDetailsForm.get('number');
  }

  validateNameInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    // const value = event.target;
    const value = this.userDetailsForm.value.number;
    const input = event.key;
    const maxLength = 10;
    if (value.length > maxLength) {
      this.number?.setValue(value.slice(0, maxLength), { emitEvent: false });
    }
  
    // Allow only alphabets and spaces
    if (!/^[a-zA-Z\s]$/.test(input) && !allowedKeys.includes(input)) {
      event.preventDefault();
    }
  }
  
  validateNumberInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const input = event.key;
  
    // Allow only numbers and the allowed keys
    if (!/^\d$/.test(input) && !allowedKeys.includes(input)) {
      event.preventDefault();
    }
  }
  
  ngOnInit() {
    firebase.initializeApp(config)
    this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
      }
    );
  }

  submitForm(){
    if (this.userDetailsForm.valid) {

      this.spinnerService.showSpinner();

      console.log(this.userDetailsForm.value);

      firebase.auth().signInWithPhoneNumber('+91'+this.userDetailsForm.value.number, this.reCaptchaVerifier).then((confirmationResult)=>{
        localStorage.setItem(
          'verificationId',
          JSON.stringify(confirmationResult.verificationId)
        );
        this.spinnerService.hideSpinner();
        this.router.navigate(['/otp_verify'])
      }).catch((error) =>{
        alert(error.message)
        setTimeout(() =>{
          window.location.reload()
        }, 5000);
      })





      // this.router.navigate(['/movie_details']);
    
      this.order_details.user_name = this.userDetailsForm.value.name;
      this.order_details.user_mobnumber = this.userDetailsForm.value.number;


    }
  }
  
}
