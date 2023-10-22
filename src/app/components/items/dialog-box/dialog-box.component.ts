import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent {
  flavorValues: any[] = [];
  additionalData: any;
  selectedAdditionalData: any;
  tempval: any;
  valueLen: any[] = [];
  flavorLen: any;
  filtered_list: any;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    for (let i = 0; i < this.data.dataitems.length; i++) {
      this.flavorValues.push('');
    }

    this.additionalData = ['Water Bottle 200ml', 'Water Bottle 500ml', 'Water Bottle 1l'];
  }

  onSelectionChange(value: any) {
    this.valueLen.push(value);
  }

  
  okey() {
    this.flavorLen = this.data.dataitems.items.length;

    if (this.flavorLen === this.valueLen.length) {
      // Your logic when everything is selected

      // If you want to filter out empty flavor values
      this.filtered_list = this.flavorValues.filter(item => item !== '');

      this.tempval = {
        category: this.data.dataitems.category,
        id: this.data.dataitems.id,
        image: this.data.dataitems.image,
        items: this.data.dataitems.items,
        name: this.data.dataitems.name,
        new_price: this.data.dataitems.new_price,
        old_price: this.data.dataitems.old_price,
        quantity: this.data.dataitems.quantity,
        total: this.data.dataitems.total,
        selectedFlavor: this.filtered_list,
        selectedAdditionalData: this.selectedAdditionalData
      };

      this.valueLen = [];
      this.dialogRef.close(this.tempval);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill Required Fields',
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
