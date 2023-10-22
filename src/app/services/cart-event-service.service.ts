import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartEventService {
  private cartItemAdded = new Subject<void>();
  private cartItemRemoved = new Subject<void>();

  cartItemAdded$ = this.cartItemAdded.asObservable();
  cartItemRemoved$ = this.cartItemRemoved.asObservable();

  emitCartItemAdded() {
    this.cartItemAdded.next();
  }

  emitCartItemRemoved() {
    this.cartItemRemoved.next();
  }
}
