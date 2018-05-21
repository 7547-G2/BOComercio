import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, ChangeDetectorRef} from '@angular/core';
import {PlatosService} from '../../services/platos.service';
import {FormControl, Validators} from '@angular/forms';
import {Dish} from '../../models/Dish';
import { TipoComida } from '../../models/tipoComida';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/add/add.dialog.html',
  styleUrls: ['../../dialogs/add/add.dialog.css']
})

export class AddDialogComponent {
  tiposDeComida: TipoComida[];
  constructor(private changeDetectorRef: ChangeDetectorRef,public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Dish,
              public dataService: PlatosService) { 
                this.dataService.getTiposDeComida().subscribe(
                  result => { this.tiposDeComida = result; }
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
  changeListener($event) : void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    if(file.size > 524288){
      alert("La imagen no debe pesar más de 512Kb");
      inputValue.value = "";
      return;
    };
    var myReader:FileReader = new FileReader();
  
    myReader.onload = (e) => {
      var img = new Image();      
      img.src = myReader.result;
      var w = img.width;
      var h = img.height;
      if (h!=w){
        alert("La imagen debe ser cuadrada");
        inputValue.value = "";
        return;
      }
    }

    myReader.onloadend = (e) => {
      this.data.imagen = myReader.result;
    }
    myReader.readAsDataURL(file);
  }  

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addIssue(this.data);
  }
}
