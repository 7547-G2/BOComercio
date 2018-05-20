import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, ChangeDetectorRef} from '@angular/core';
import {OpcionesService} from '../../../services/opciones.service';
import {FormControl, Validators} from '@angular/forms';
import {Opcion} from '../../../models/Opcion';

@Component({
  selector: 'app-add.dialog',
  templateUrl: './add.dialog.html',
  styleUrls: ['./add.dialog.css']
})

export class AddOpcionDialogComponent {
  constructor(private changeDetectorRef: ChangeDetectorRef,public dialogRef: MatDialogRef<AddOpcionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Opcion,
              public dataService: OpcionesService) { 
              }

  formControl = new FormControl('', [
    Validators.required  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido':'';
  }

  submit() {
  // emppty stuff
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addOpcion(this.data);
  }
}
