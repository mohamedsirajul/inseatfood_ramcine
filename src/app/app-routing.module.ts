import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './components/order/order.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { ItemsComponent } from './components/items/items.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';
import { TrackingdataComponent } from './components/trackingdata/trackingdata.component';
import { OtpComponent } from './components/auth/otp/otp.component';
import { OtpVerifyGuard } from './components/auth/otp/otp-verify.guard';
import { MobileNumberGuard } from './components/user-details/mobile-number.guard';

const routes: Routes = [
  { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: 'order', component: OrderComponent },
  { path: 'user_details', component: UserDetailsComponent , },
  { path: 'movie_details', 
    component: MovieDetailsComponent, 
    // canActivate: [MobileNumberGuard] ,
  },
  { path: 'items', component: ItemsComponent ,
  //  canActivate: [MobileNumberGuard] ,
},
  { path: 'cart',
   component: CartComponent,
  //  canActivate: [MobileNumberGuard] ,
 },
  { path: 'otp_verify', 
    component: OtpComponent, 
    // canActivate: [MobileNumberGuard] ,
  },
  {
    path: 'payments',
    component: PaymentComponent,
   }, 
  { path: 'tracking_details', component: TrackingdataComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
