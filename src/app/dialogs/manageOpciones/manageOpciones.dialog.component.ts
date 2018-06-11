import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { OpcionesService } from '../../services/opciones.service';
import { FormControl, Validators } from '@angular/forms';
import { Opcion } from '../../models/Opcion';
import { Dish } from '../../models/Dish';

@Component({
  selector: 'app-add.dialog',
  templateUrl: './manageOpciones.dialog.html',
  styleUrls: ['./manageOpciones.dialog.css']
})

export class ManageOpcionesDialogComponent {
  source = [];
  target = [];
  format = { add: 'Agregar', remove:'Quitar', all: 'Todos', none: 'Ninguno'}
  constructor(private changeDetectorRef: ChangeDetectorRef, public dialogRef: MatDialogRef<ManageOpcionesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: OpcionesService) {
    this.dataService.getOpciones().subscribe(
      result => {
      this.source = result;
      this.target = this.source.filter(item => data.opcionalIds.indexOf(item.id) > -1);
      }
    );
  }


  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido' : '';
  }

  submit() {
    // emppty stuff
  }
  // cha

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.updateDishOptions(this.target);
  }
}
