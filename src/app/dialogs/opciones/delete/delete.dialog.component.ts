import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {OpcionesService} from '../../../services/opciones.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: './delete.dialog.html',
  styleUrls: ['./delete.dialog.css']
})
export class DeleteOpcionDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteOpcionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: OpcionesService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteOpcion(this.data);
  }
}
