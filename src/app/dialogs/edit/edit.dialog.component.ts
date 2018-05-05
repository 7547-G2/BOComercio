import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: '../../dialogs/edit/edit.dialog.html',
  styleUrls: ['../../dialogs/edit/edit.dialog.css']
})
export class EditDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService) { }

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

  stopEdit(): void {
    this.dataService.updateIssue(this.data);
  }
}
