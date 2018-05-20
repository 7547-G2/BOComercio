import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {PlatosService} from '../../services/platos.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: '../../dialogs/delete/delete.dialog.html',
  styleUrls: ['../../dialogs/delete/delete.dialog.css']
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: PlatosService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteIssue(this.data);
  }
}
