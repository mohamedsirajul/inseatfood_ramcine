import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent {

  // movieDetailsForm: FormGroup;
  movieNames: any[] = ['Irugapatru',];
  mve_time: any[] = [
    '11:30 AM',
    '02:45 PM',
    '06:30 PM',
    '10:30 PM'
  ];
  radioItems: any;


  theaterSetup: string[][] = [
    ['A1', 'A2', 'A3', 'A4', 'A5'],
    ['B1', 'B2', 'B3', 'B4', 'B5'],
    ['C1', 'C2', 'C3', 'C4', 'C5'],
    ['D1','','','D4','D5'],
  ];



  selectedMovie : any;
  selectedmve_time : any
  selectedSeat: any;
  showError: boolean = false; // New variable to track error display
  model   = {option: ''};
  tempval: any = {};
  currentTime: Date = new Date(); // Add current time variable
  mvedetails: any [] = [];

  constructor(
    private router: Router,
    private order_details: OrderServiceService,
    private spinnerService: SpinnerService,
    ) { }


  // getSeatsInRow(rowIndex: number): string[] {
  //   return this.theaterSetup[rowIndex];
  // }

  // selectSeat(seat: string) {
  //   this.selectedSeat = seat;
  // }

  submitForm() {
   
    if(this.selectedSeat != null){
      
      this.spinnerService.showSpinner();
      this.tempval={
        selectedMovie:this.selectedMovie,
        selectedmve_time:this.selectedmve_time,
        selectedSeat:this.selectedSeat
      }
      
      console.log(this.tempval);
      this.showError = false;

      this.order_details.moviename = this.selectedMovie;
      this.order_details.selectedmve_time = this.selectedmve_time;
      this.order_details.seatnumber = this.selectedSeat;
      this.spinnerService.hideSpinner();
      this.router.navigate(['/items']);

    }
    else {
      this.spinnerService.hideSpinner();
      this.showError = true;
    }


      
  }
  ngOnInit(): void {
    this.selectedMovie = this.movieNames[0]
    this.selectedmve_time = this.mve_time[0]
    this.selectedSeat = null
    this.radioItems = ['Balcony A', 'Balcony B', 'Platinum' , 'Gold'];
    this.filterMovieTimes();

  }
  
  filterMovieTimes() {
    const currentTimeString = this.currentTime.toLocaleTimeString('en-US', { hour12: false });
    const currentHour = parseInt(currentTimeString.slice(0, 2), 10);
    const currentMinutes = parseInt(currentTimeString.slice(3, 5), 10);
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
  
    // Filter out movie times that have already passed
    // console.log(this.mve_time);
    
    for(let i=1; i<this.mve_time.length; i++){
      // console.log(this.mve_time[i]);
      this.mvedetails.push(this.mve_time[i])
    }
    console.log(this.mvedetails);


    this.mve_time = this.mve_time.filter(time => {
      const [timePart, amPm] = time.split(' ');
      const [hour, minutes] = timePart.split(':').map(Number);
  
      // Convert to 24-hour format if it's PM
      const adjustedHour = amPm === 'PM' && hour !== 12 ? hour + 12 : hour;
  
      const movieTimeInMinutes = adjustedHour * 60 + minutes;
      return movieTimeInMinutes >= currentTimeInMinutes;
    });
  
    // Set the default selected time
    if (this.mve_time.length > 0) {
      this.selectedmve_time = this.mve_time[0];
      console.log(this.mve_time);
    }
  }
   
}
