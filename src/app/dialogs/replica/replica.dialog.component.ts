import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {ComentariosService} from '../../services/comentarios.service';
import {FormControl, Validators} from '@angular/forms';
import { Comentario } from '../../models/Comentario';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: './replica.dialog.html',
  styleUrls: ['./replica.dialog.css']
})
export class ReplicaDialogComponent {

  constructor(public dialogRef: MatDialogRef<ReplicaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ComentariosService) { console.log(data);}

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.replyCustomer(this.data);
  }
}
