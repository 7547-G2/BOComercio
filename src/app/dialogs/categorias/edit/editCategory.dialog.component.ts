import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, ChangeDetectorRef} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Dish} from '../../../models/Dish';
import { CategoriaPlato} from '../../../models/categoriaPlato';
import { CategoriaService } from '../../../services/categorias.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: 'editCategory.dialog.html',
  styleUrls: ['editCategory.dialog.css']
})

export class EditCategoryDialogComponent {
  constructor(private changeDetectorRef: ChangeDetectorRef,public dialogRef: MatDialogRef<EditCategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dataService: CategoriaService) { 
                console.log(data);
              }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido':'';
  }

  submit() {
  // emppty stuff
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmEdit(): void {
    this.dataService.editCategory(this.data);
  }
}
