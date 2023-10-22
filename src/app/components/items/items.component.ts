import { Component, HostListener, OnInit , EventEmitter } from '@angular/core';
import { DatapassService } from 'src/app/services/datapass.service';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CartEventService } from 'src/app/services/cart-event-service.service';
import * as AOS from 'aos';
import { SpinnerService } from 'src/app/services/spinner.service';
import { trigger, transition, style, animate } from '@angular/animations';
import {ThemePalette} from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';



interface Flavor {
  value: string;
}

interface FlavorGroup {
  name: string;
  flavor: Flavor[];
}

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ItemsComponent implements OnInit {


  // pokemonControl = new FormControl('');

  // flavorGroups: FlavorGroup[] = [
  //   {
  //     name: 'Popcorn',
  //     flavor: [
  //       {value: 'Cheese Popcorn'},
  //       {value: 'Tomatto Popcorn'},
  //     ],
  //   },
  //   {
  //     name: 'Soft Drinks',
  //     flavor: [
  //       {value: 'Pepsi'},
  //       {value: 'merinda'},

  //     ],
  //   },
  // ];









  counter = 0;
  public filterCategory: any;
  public productList: any;
  isScreenLarge = false;
  private mediaMatcher: MediaQueryList = matchMedia('(max-width: 900px)');
  searchkey = "";
  temp_id: any;
  data: never[] | undefined;
  showSearch = false;
  searchText = '';

  toggleSearch: boolean = false;
  color: ThemePalette = 'warn';
  checked = false;
  disabled = false;

  // Correct the output property to follow the naming convention
  checkedChange = new EventEmitter<boolean>();

  openSearch() {
    this.toggleSearch = true;
  }

  searchClose() {
    this.searchText = '';
    this.toggleSearch = false;
  }

  search(event: any) {
    this.searchText = (event.target as HTMLInputElement).value;
    console.log(this.searchText);
    this.datapass.search.next(this.searchText);
  }

  constructor(
    private datapass: DatapassService,
    private cartService: CartServiceService,
    private toastr: ToastrService,
    private spinnerService: SpinnerService,
    private cartEventService: CartEventService,
    public dialog: MatDialog
  ) {
    this.isScreenLarge = this.mediaMatcher.matches;
    this.mediaMatcher.addListener((mediaQueryListEvent) => {
      this.isScreenLarge = mediaQueryListEvent.matches;
    });
  }

  ngOnInit(): void {
    AOS.init();
    this.spinnerService.showSpinner();
    this.datapass.getProduct().subscribe((res) => {
      this.spinnerService.hideSpinner();
      this.productList = res;

      console.log(this.productList);

      this.filterCategory = res;
      console.log(this.filterCategory);
      

      this.productList.forEach((a: any) => {
        Object.assign(a, { quantity: 0, total: a.new_price });
      });

      // Update the cart counter when the component initializes
      this.filter('');
      this.updateCounter();
    });

    this.cartEventService.cartItemAdded$.subscribe(() => {
      this.updateCounter();
    });

    this.cartEventService.cartItemRemoved$.subscribe(() => {
      this.updateCounter();
    });
  }

  increaseCounter(item: any) {
    item.quantity++;
  }

  decreaseCounter(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
    }
  }
  filter(category: string) {
    this.filterCategory = this.productList.filter((item: any) => {
      if ((category === '' || item.category === category) &&
          (this.checked ? item.type === 'Veg' : item.type === 'Non-Veg')) {
        return true;
      }
      return false;
    });
  }
  
  

  @HostListener('window:scroll', ['$event'])
  onScrollEvent(event: any) {
    this.animateCardsOnScroll();
  }

  animateCardsOnScroll() {
    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach((element: any) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible) {
        element.classList.add('aos-init');
        element.classList.add('aos-animate');
      } else {
        element.classList.remove('aos-init');
        element.classList.remove('aos-animate');
      }
    });
  }

  Add_openDialog(item: any) {
    console.log(item);
        
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      disableClose:true,
      width: 'auto',
      height: 'auto',
      data: { dataitems : item},
    });
  
    dialogRef.afterClosed().subscribe((cartDetails) => {
      console.log(cartDetails);
  
 
      this.addToCart(cartDetails)
    });
  }


  addToCart(item: any) {
    if (item.quantity === 0) {
      Swal.fire({
        icon: 'error',
        title: "<h1 style='color:white'>" + 'Oops...' + '</h1>',
        html: "<h5 style='color:white'>" + 'Please Select Quantity' + '</h5>',
        text: 'No Products',
        background: '#1a1a1a',
        iconColor: 'white',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    } else {
      const existingCartItem = this.cartService.getCartItem(item.id);

      if (existingCartItem) {
        Swal.fire({
          title: "<h1 style='color:white'>" + 'Product already in cart!' + '</h1>',
          html: "<h5 style='color:white'>" + 'Do you want to add the quantity?' + '</h5>',
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Add',
          confirmButtonColor: '#d33',
          showConfirmButton: true,
          background: '#1a1a1a',
          iconColor: 'white',
        }).then((result) => {
          if (result.isConfirmed) {
            existingCartItem.quantity += item.quantity;
            existingCartItem.total = existingCartItem.new_price * existingCartItem.quantity;
            this.cartService.updateCartItem(existingCartItem.id, existingCartItem.quantity);

            this.toastr.success('Quantity updated in cart!', 'Success');
          }
        });
      } else {
        const itemToAdd = JSON.parse(JSON.stringify(item)); // Make a deep copy of the item
        this.cartService.add_cart(itemToAdd); // Add the deep copy to the cart

        Swal.fire({
          icon: 'success',
          title: "<h1 style='color:white'>" + 'Item added to cart!' + '</h1>',
          showConfirmButton: false,
          background: '#1a1a1a',
          iconColor: 'white',
          timer: 1000
        });
      }
    }
  }

  updateCounter() {
    this.counter = this.cartService.getCartItems().length;
    // console.log(this.counter);
    
  }
}
