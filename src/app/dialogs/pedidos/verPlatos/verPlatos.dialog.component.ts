import { MAT_DIALOG_DATA, MatDialogRef, MatRadioModule, MatDialog, MatTableDataSource } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: 'verPlatos.dialog.html',
  styleUrls: ['verPlatos.dialog.css']
})
export class viewDishesComponent {

  constructor(public dialogRef: MatDialogRef<viewDishesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[], public dataService: DataService) {
      
  }

  dataSource = new MatTableDataSource(this.data);
  displayedColumns = ['Plato', 'opciones', 'cantidad'];

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
