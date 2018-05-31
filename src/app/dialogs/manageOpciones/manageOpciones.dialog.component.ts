import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { OpcionesService } from '../../services/opciones.service';
import { FormControl, Validators } from '@angular/forms';
import { Opcion } from '../../models/Opcion';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/manageOpciones/manageOpciones.dialog.html',
  styleUrls: ['../../dialogs/manageOpciones/manageOpciones.dialog.css']
})

export class ManageOpcionesDialogComponent {
  source = [];
  target = [];
  format = { add: 'Agregar', remove:'Quitar', all: 'Todos', none: 'Ninguno'}
  constructor(private changeDetectorRef: ChangeDetectorRef, public dialogRef: MatDialogRef<ManageOpcionesDialogComponent>,
    public dataService: OpcionesService) {
    this.dataService.getAllOpciones().subscribe(
      result => {
      this.source = result;
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
    console.log(this.target);
  }
}
