import {MAT_DIALOG_DATA, MatDialogRef, MatRadioModule, MatDialog} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {PlatosService} from '../../../services/platos.service';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: 'edit.dialog.html',
  styleUrls: ['edit.dialog.css']
})
export class ModifyStateComponent {

  constructor(public dialogRef: MatDialogRef<ModifyStateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: PlatosService) {
               }

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
    this.dataService.updatePedido(this.data);
  }
}
