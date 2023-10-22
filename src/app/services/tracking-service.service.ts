import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class TrackingServiceService {

  private orderDetails: any[] = [];

  constructor(private http: HttpClient) { 

  }

  get userOrderDetails(): any[] {
    return this.orderDetails;
  }


  get_order_data(orderNo: string, mobileNum: string): Observable<any> {
    const data = { orderId: orderNo, userMobileNum: mobileNum };

    const jsonData = JSON.stringify(data);

    console.log(jsonData);
    
    return this.http.post<any>(`https://zenanvibe.com/inseatfood_ram/get_order_data.php`, jsonData);
  }
}
