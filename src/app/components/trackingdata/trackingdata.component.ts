import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { TrackingServiceService } from 'src/app/services/tracking-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-trackingdata',
  templateUrl: './trackingdata.component.html',
  styleUrls: ['./trackingdata.component.css']
})
export class TrackingdataComponent {
  userDetailsForm: FormGroup;
  productDetails: any[] = [];
  orderDetails: any;

  // tempval:;
  hideResponse: boolean = true;
  showResponse: boolean = false;
  totalAmount: any;
  ord_no: any;
  product_arr: any;
  tot_amt: any;
  ordd_No: any;
  UserId: any;
  TransactionId: any;
  loading: boolean = false; // Add the loading variable to track the loading state


  constructor(
     private formBuilder: FormBuilder,
     private router: Router , 
     private order_details: OrderServiceService,
     private trackingService: TrackingServiceService,
      ){
    this.userDetailsForm = this.formBuilder.group({
      order_no: ['', [Validators.required, ]],
      number: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')]]
    })
  }

  get order_no() {
    return this.userDetailsForm.get('order_no');
  }

  get number() {
    return this.userDetailsForm.get('number');
  }

  validateNumberInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const input = event.key;
  
    // Allow only numbers and the allowed keys
    if (!/^\d$/.test(input) && !allowedKeys.includes(input)) {
      event.preventDefault();
    }
  }
  
  scanedForm(scannedData:any){
    console.log('Scanned data:', scannedData);
    
  }

  submitForm() {
    if (this.userDetailsForm.valid) {
      console.log(this.userDetailsForm.value);
      this.loading = true;

      const orderNo = this.userDetailsForm.value.order_no;
      const mobileNum = this.userDetailsForm.value.number;

    this.trackingService.get_order_data(orderNo, mobileNum).subscribe(
        (response: any) => {
          console.log('Order data:', response);

          this.productDetails = response.salesDetails
          this.orderDetails = response.orderDetails
          this.hideResponse = false;
          this.showResponse = true; 
          console.log(this.productDetails);
          // localStorage.setItem('productDetails', JSON.stringify(this.productDetails));
          // localStorage.setItem('orderDetails', JSON.stringify(this.orderDetails));
          // localStorage.setItem('totalAmount', this.totalAmount);
          // localStorage.setItem('ord_no', this.ord_no);

          // this.product_arr = localStorage.getItem('productDetails');
          // this.tot_amt = localStorage.getItem('totalAmount');
          // this.ordd_No = localStorage.getItem('userNumber');

          this.totalAmount = response.orders_total
          this.ord_no = response.order_num

          // console.log(this.orderDetails.user_id);
          this.UserId = this.orderDetails.user_id
          this.TransactionId = this.orderDetails.transaction_id
          this.loading = false;

        },
        (error: any) => {

          console.log(error.error)
          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: "<h1 style='color:white'>" + 'Oops...' + '</h1>',
            html: "<h6 style='color:white;font-size:15px'>" + 'Order not found. Please check the orderId and userMobileNum.' + '</h6>',
            text: 'No Products',
            background: '#1a1a1a',
            iconColor: 'white',
            showConfirmButton: false,
            timer: 3000
          });
        }
      );
    }

    
  }


   
 
}
