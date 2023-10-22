import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {
  private orderPlaced = false;

  setOrderPlacedStatus(status: boolean) {
    this.orderPlaced = status;
    console.log(this.orderPlaced);
    
  }

  isOrderPlaced() {
    return this.orderPlaced;
  }
}
