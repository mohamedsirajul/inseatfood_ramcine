import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inseatfood';

  showSpinner: Observable<boolean> = this.spinnerService.getSpinnerVisibility();

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {
  }
}
