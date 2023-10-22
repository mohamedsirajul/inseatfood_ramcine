import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  // Define properties to store user details
  private userName: string = '';
  private userNumber: string = '';
  private movieName: string = '';
  private selected_mve_time: string = '';
  private seatNumber: string = '';
  private cartItems: any[] = [];

  tempval: any;

  // PHP_USER_SERVER = "https://zenanvibe.com/siraj";
  
  cartval: any;
  carts_arr: any[] = [];

  constructor(private httpClient: HttpClient) {}

  // Getter and setter for user name
  get user_name(): string {
    return this.userName;
  }

  set user_name(value: string) {
    this.userName = value;
    console.log(this.userName);
    localStorage.setItem('userName', value);
  }

  get user_mobnumber(): string {
    return this.userNumber;
  }

  set user_mobnumber(value: string) {
    this.userNumber = value;
    console.log(this.userNumber);
    localStorage.setItem('userNumber', value);
  }

  get moviename(): string {
    return this.movieName;
  }

  set moviename(value: string) {
    this.movieName = value;
    console.log(this.movieName);
    localStorage.setItem('movieName', value);
  }

  get seatnumber(): string {
    return this.seatNumber;
  }

  set seatnumber(value: string) {
    this.seatNumber = value;
    console.log(this.seatNumber);
    localStorage.setItem('seatNumber', value);
  }

  get selectedmve_time(): string {
    return this.selectedmve_time;
  }

  set selectedmve_time(value: string) {
    this.selected_mve_time = value;
    console.log(this.selected_mve_time);
    localStorage.setItem('selected_mve_time', value);
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  setCartItems(cartItems: any[]) {
    this.cartItems = cartItems;
    console.log(this.cartItems);

    this.carts_arr = []; // Initialize carts_arr as an empty array

for (let i = 0; i < this.cartItems.length; i++) {
  // Create a new object for each cart item
  const cartval = {
    id: this.cartItems[i].id,
    name: this.cartItems[i].name,
    new_price: this.cartItems[i].new_price,
    quantity: this.cartItems[i].quantity,
    total: this.cartItems[i].total,
    selectedFlavor: this.cartItems[i].selectedFlavor,
    selectedAdditionalData : this.cartItems[i].selectedAdditionalData

  };
  
  this.carts_arr.push(cartval); // Push the cart item object into carts_arr
  console.log(this.carts_arr);
  
}

    
    localStorage.setItem('carts_arr', JSON.stringify(this.carts_arr));
    
    const userName = localStorage.getItem('userName');
    const userNumber = localStorage.getItem('userNumber');
    const movieName = localStorage.getItem('movieName');
    const seatNumber = localStorage.getItem('seatNumber');
    const selected_mve_time = localStorage.getItem('selected_mve_time');
    const carts_arr = localStorage.getItem('carts_arr');


    // console.log(carts_arr);
    // console.log(userName);
    
    
    console.log(localStorage);
    
    this.tempval = {
      userName: userName,
      userMobileNum: userNumber,
      movieName: movieName,
      movieTime: selected_mve_time,
      seatNumber: seatNumber,
      items: this.carts_arr,
    };

    console.log(this.tempval);

  
    const jsonData = JSON.stringify(this.tempval);
    console.log(jsonData);

    // Remove a specific item from local storage
    // localStorage.removeItem('cartItems');
    
    // console.log(localStorage);
    


    // Send the order data to the server
    return this.httpClient.post<any>(`https://zenanvibe.com/inseatfood_ram/ordersales_report.php`, jsonData);
  }
  
}
