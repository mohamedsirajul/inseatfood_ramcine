import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetPaymentStatusService {

  constructor(private http: HttpClient) {}

  getPayment_data(tnx:any){
		let tnx_id = JSON.stringify(tnx)
		console.log(tnx_id);

		return this.http.post<any>(`https://zenanvibe.com/inseatfood_ram/payment_status_data.php`, tnx_id);
	}
}
