import { Injectable } from '@angular/core';
import { CartEventService } from './cart-event-service.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private cartItems: any[] = [];
  private counter: any;
  public search = new BehaviorSubject<string>("");

  private readonly CART_STORAGE_KEY = 'cartItems';
  Response_data: any;

  constructor(private cartEventService: CartEventService) {
    this.loadCartItemsFromLocalStorage();
  }

  private loadCartItemsFromLocalStorage() {
    const cartItemsJson = localStorage.getItem(this.CART_STORAGE_KEY);
    if (cartItemsJson) {
      this.cartItems = JSON.parse(cartItemsJson);
      this.updateCounter();
    }
  }

  private saveCartItemsToLocalStorage() {
    const cartItemsJson = JSON.stringify(this.cartItems);
    localStorage.setItem(this.CART_STORAGE_KEY, cartItemsJson);
    this.updateCounter();
  }

  add_cart(item: any) {
    this.cartItems.push(item);
    this.saveCartItemsToLocalStorage();
    this.cartEventService.emitCartItemAdded(); // Emit the cart item added event
    console.log(item);
  }

  removeCartItem(product: any) {
    console.log(product);
    
    this.cartItems = this.cartItems.filter((a) => product.id !== a.id);
    this.saveCartItemsToLocalStorage();
    this.cartEventService.emitCartItemRemoved(); // Emit the cart item removed event
    console.log(this.cartItems);
    
  }

  getCartItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
    this.saveCartItemsToLocalStorage();
  }

  updateCartItem(id: number, quantity: number): void {
    const cartItem = this.cartItems.find((item) => item.id === id);
    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.total = cartItem.price * quantity;
  
      // Update the corresponding item in the cartItems array
      const index = this.cartItems.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.cartItems[index] = cartItem;
      }
    }
    this.saveCartItemsToLocalStorage();
  }

  getCartItem(id: number): any {
    return this.cartItems.find((item) => item.id === id);
  }

  updateCounter() {
    this.counter = this.cartItems.length;
  }

  getResponse(responses:any){    
    this.Response_data = responses
    
    console.log(this.Response_data);
    
  }

  setResponse(){
    return this.Response_data;
  }
}
