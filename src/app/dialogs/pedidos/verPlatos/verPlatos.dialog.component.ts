import { MAT_DIALOG_DATA, MatDialogRef, MatRadioModule, MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PedidosService } from '../../../services/pedidos.service';
import { Observable } from 'rxjs/Observable';
import { Pedido, Plato } from '../../../pedidos';
import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PedidosPlatosService } from '../../../services/pedidosPlatos.service';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: 'verPlatos.dialog.html',
  styleUrls: ['verPlatos.dialog.css']
})
export class viewDishesComponent {

  constructor(public dialogRef: MatDialogRef<viewDishesComponent>,
    public httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any, public platosService: PedidosPlatosService) {
      console.log(this.data);
      this.loadData();
  }



  dataSource: PlatosDataSource|null;
  displayedColumns = ['Plato', 'opciones', 'cantidad','observacion'];
  platos: Plato[];

  public loadData() {
    this.platosService = new PedidosPlatosService(this.httpClient);//, this.changeDetectorRefs);
    this.dataSource = new PlatosDataSource(this.platosService, this.data.id);
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



export class PlatosDataSource extends DataSource<Plato> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  renderedData: Plato[] = [];

  constructor(public platosDatabase: PedidosPlatosService,
    public id: number) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Plato[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.platosDatabase.platos,
      this._filterChange
    ];

    this.platosDatabase.getPlatos(this.id);

    return Observable.merge(...displayDataChanges).switchMap(() => {

      
      // Grab the page's slice of the filtered sorted data.
      
      this.renderedData = this.platosDatabase.data;//.splice(startIndex, this._paginator.pageSize);
      //this._paginator._changePageSize(this._paginator.pageSize); 
      return Observable.of(this.renderedData);
    });
  }
  disconnect() {
  }


}
