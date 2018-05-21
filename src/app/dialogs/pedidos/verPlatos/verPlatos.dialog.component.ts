import { MAT_DIALOG_DATA, MatDialogRef, MatRadioModule, MatDialog, MatTableDataSource } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PedidosService } from '../../../services/pedidos.service';
import { Observable } from 'rxjs/Observable';
import { Pedido, Plato } from '../../../pedidos';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: 'verPlatos.dialog.html',
  styleUrls: ['verPlatos.dialog.css']
})
export class viewDishesComponent {

  constructor(public dialogRef: MatDialogRef<viewDishesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: PedidosService) {
      console.log(this.data);
      this.loadData();
  }

  dataSource = new MatTableDataSource();
  displayedColumns = ['Plato', 'opciones', 'cantidad','observacion'];
  pedidos: Plato[];

  public loadData() {
    this.dataService.getPlatos(this.data.id).subscribe(
        result => {this.pedidos = result;}
    );
    console.log(this.pedidos);
    this.dataSource = new MatTableDataSource(this.pedidos);
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
    //this.dataService.updatePedido(this.data);
  }
}
