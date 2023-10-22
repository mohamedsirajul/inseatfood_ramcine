// spinner.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerVisibility = new BehaviorSubject<boolean>(false);

  showSpinner() {
    this.spinnerVisibility.next(true);
  }

  hideSpinner() {
    this.spinnerVisibility.next(false);
  }

  getSpinnerVisibility(): Observable<boolean> {
    return this.spinnerVisibility.asObservable();
  }
  
}
