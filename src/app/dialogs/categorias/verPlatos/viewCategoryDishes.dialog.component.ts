import { MAT_DIALOG_DATA, MatDialogRef, MatRadioModule, MatDialog, MatTableDataSource } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PlatosService } from '../../../services/platos.service';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: 'viewCategoryDishes.dialog.html',
  styleUrls: ['viewCategoryDishes.dialog.css']
})
export class viewCategoryDishesComponent {

  constructor(public dialogRef: MatDialogRef<viewCategoryDishesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[], public dataService: PlatosService) {
      console.log('llego')
      console.log(this.data)
  }

  dataSource = new MatTableDataSource(this.data);
  displayedColumns = ['imagen','nombre','precio'];

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    //this.dataService.updatePedido(this.data);
  }
}
