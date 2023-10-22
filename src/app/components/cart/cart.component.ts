import { Component, OnInit } from '@angular/core';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CartEventService } from 'src/app/services/cart-event-service.service';
import { Router } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { OrderStatusService } from 'src/app/services/order-status.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { PaymentService } from 'src/app/services/payment.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  counter: number = 0;
  isScreenLarge = false;
  private mediaMatcher: MediaQueryList = matchMedia('(max-width: 900px)');
  price: any;
  quantity: any;
  data_Response: any;
  cartResponse: any;
  redirectURL: string | undefined;
  item: any;
  public filterCategory: any;

  constructor(
    private cartService: CartServiceService,
    private toastr: ToastrService,
    private cartEventService: CartEventService,
    private router: Router,
    private order_details: OrderServiceService,
    private orderStatusService: OrderStatusService,
    private SVC: PaymentService,
    private spinnerService: SpinnerService // Inject the SpinnerService here
  ) {
    this.isScreenLarge = this.mediaMatcher.matches;
    this.mediaMatcher.addListener((mediaQueryListEvent) => {
      this.isScreenLarge = mediaQueryListEvent.matches;
    });
  }

  ngOnInit(): void {
    this.updateCartItems();
    this.updateCounter();
    console.log(this.cartItems);

    this.filterCategory = [
      {
        name : "Water Bottel",
        image: "https://inseatfood.in/ram/ram/waterbottle.webp",
        new_price: 30,
        old_price: 15
      }
    ]

    this.filterCategory.forEach((a: any) => {
      Object.assign(a, { quantity: 0, total: a.new_price });
    });

    this.cartEventService.cartItemAdded$.subscribe(() => {
      this.updateCartItems();
      this.updateCounter();
    });

    this.cartEventService.cartItemRemoved$.subscribe(() => {
      this.updateCartItems();
      this.updateCounter();
    });
  }

  addToCart(item: any) {
    if (item.quantity === 0) {
      Swal.fire({
        icon: 'error',
        title: "<h1 style='color:white'>" + 'Oops...' + '</h1>',
        html: "<h5 style='color:white'>" + 'Please Select Quantity' + '</h5>',
        text: 'No Products',
        background: '#1a1a1a',
        iconColor: 'white',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    } else {
      const existingCartItem = this.cartService.getCartItem(item.id);

      if (existingCartItem) {
        Swal.fire({
          title: "<h1 style='color:white'>" + 'Product already in cart!' + '</h1>',
          html: "<h5 style='color:white'>" + 'Do you want to add the quantity?' + '</h5>',
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Add',
          confirmButtonColor: '#d33',
          showConfirmButton: true,
          background: '#1a1a1a',
          iconColor: 'white',
        }).then((result) => {
          if (result.isConfirmed) {
            existingCartItem.quantity += item.quantity;
            existingCartItem.total = existingCartItem.new_price * existingCartItem.quantity;
            this.cartService.updateCartItem(existingCartItem.id, existingCartItem.quantity);

            this.toastr.success('Quantity updated in cart!', 'Success');
          }
        });
      } else {


        if (this.totalAmount >= 220) {

          const itemToAdd = JSON.parse(JSON.stringify(item)); // Make a deep copy of the item
          this.cartService.add_cart(itemToAdd); // Add the deep copy to the cart

          // this.cartService.clearCart();
          // this.cartItems = [];
        } else {
          // Otherwise, update the total amount
          this.totalAmount;
        }

        Swal.fire({
          icon: 'success',
          title: "<h1 style='color:white'>" + 'Item added to cart!' + '</h1>',
          showConfirmButton: false,
          background: '#1a1a1a',
          iconColor: 'white',
          timer: 1000
        });
      }
    }
  }

  updateCartItems() {
    this.cartItems = this.cartService.getCartItems();    
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    let total = 0;
    for (const item of this.cartItems) {
      // this.price = item.new_price
      // this.quantity = item.quantity
      item.total = item.new_price * item.quantity;

      total += item.total;
    }
    this.totalAmount = total;
    console.log(this.totalAmount);
    
  }

  updateCounter() {
    this.counter = this.cartItems.length;
  }

  removeItem(item: any) {

    Swal.fire({
      title: "<h1 style='color:white'>" + 'Are you sure?' + "</h1>",
      html: "<h5 style='color:white'>" + 'Do you want to remove this item from the cart?' + '</h5>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      showConfirmButton: true,
      background: '#1a1a1a',
      iconColor: 'white',
    }).then((result) => {
      if (result.isConfirmed) {
        if (item) {
          this.item = item
          this.cartService.removeCartItem(item);
          this.cartItems = this.cartService.getCartItems();
          this.calculateTotalAmount();
          this.updateCounter();
        } else {
          console.error('Item is undefined.');
        }
        Swal.fire({
          icon: 'success',
          title: "<h1 style='color:white'>" + 'Deleted!' + '</h1>',
          html: "<h5 style='color:white'>" + 'The item has been removed from the cart.' + '</h5>',
          showConfirmButton: false,
          background: '#1a1a1a',
          iconColor: 'white',
          timer: 1000
        });
      }
    });
  }


 
  emptyCart() {
   
    Swal.fire({
      title: "<h1 style='color:white'>" + 'Are you sure?' + "</h1>",
      html: "<h5 style='color:white'>" + 'Do you want to remove all the item from the cart?' + '</h5>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      showConfirmButton: true,
      background: '#1a1a1a',
      iconColor: 'white',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        this.cartItems = [];
        this.totalAmount = 0;
        this.updateCounter();
        Swal.fire({
          icon: 'success',
          title: "<h1 style='color:white'>" + 'Deleted!' + '</h1>',
          html: "<h5 style='color:white'>" + 'The all item has been removed from the cart.' + '</h5>',
          showConfirmButton: false,
          background: '#1a1a1a',
          iconColor: 'white',
          timer: 2000
        });
      }
    });
  }


  increaseCounter(item: any) {
    item.quantity++;
  }

  decreaseCounter(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
    }
  }

  confirmOrder() {
    if (this.cartService.getCartItems().length > 0) {
      this.spinnerService.showSpinner();
      this.order_details.setCartItems(this.cartService.getCartItems())
           .subscribe(  
            (response) => {

              this.data_Response = response;
              console.log(this.data_Response);
              
              this.redirectURL = response.external_response.data.instrumentResponse.redirectInfo.url;
              console.log(this.data_Response);
              
              this.SVC.getResponse = this.data_Response;

              this.orderStatusService.setOrderPlacedStatus(true);

              this.spinnerService.hideSpinner();
         
              window.location.replace(this.redirectURL!);
              this.cartService.clearCart();
              this.cartItems = [];
              this.totalAmount = 0;
              this.updateCounter();


            },
            (error) => {
              console.error('Failed to place order:', error);

              console.log('Error response from server:', error.error);

              this.toastr.error('Failed to place order. Please try again later.', 'Error');
            }
          );
      } else {
        console.warn('Cannot place order with an empty cart');

        this.toastr.warning('Your cart is empty. Add items before placing an order.', 'Warning');
      }
    }
  }
