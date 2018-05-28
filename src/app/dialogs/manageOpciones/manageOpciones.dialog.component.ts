import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, ChangeDetectorRef} from '@angular/core';
import {PlatosService} from '../../services/platos.service';
import {FormControl, Validators} from '@angular/forms';
import {Dish} from '../../models/Dish';
import { CategoriaPlato, CategoriaPlatoPost } from '../../models/categoriaPlato';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/addCategory/addCategory.dialog.html',
  styleUrls: ['../../dialogs/addCategory/addCategory.dialog.css']
})

export class AddOpcionesDialogComponent {
  categorias: CategoriaPlato[];
  constructor(private changeDetectorRef: ChangeDetectorRef,public dialogRef: MatDialogRef<AddOpcionesDialogComponent>,
              public dataService: OpcionesService) { 
                this.dataService.getCategorias().subscribe(
                  result => { this.categorias = result; }
                );
              }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  public file_srcs: string[] = [];  

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido':'';
  }

  submit() {
  // emppty stuff
  }
  // changeListener($event) : void {
  //   this.readThis($event.target);
  // }
  
  // readThis(inputValue: any): void {
  //   var file:File = inputValue.files[0];
  //   if(file.size > 524288){
  //     alert("La imagen no debe pesar más de 512Kb");
  //     inputValue.value = "";
  //     return;
  //   };
  //   var myReader:FileReader = new FileReader();
  
  //   myReader.onload = (e) => {
  //     var img = new Image();      
  //     img.src = myReader.result;
  //     var w = img.width;
  //     var h = img.height;
  //     if (h!=w){
  //       alert("La imagen debe ser cuadrada");
  //       inputValue.value = "";
  //       return;
  //     }
  //   }

  //   myReader.onloadend = (e) => {
  //     this.data.imagen = myReader.result;
  //   }
  //   myReader.readAsDataURL(file);
  // }  

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addCategory(this.data);
  }
}
