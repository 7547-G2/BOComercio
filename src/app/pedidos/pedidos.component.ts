import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { PedidosService } from '../services/pedidos.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatSortModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { viewDishesComponent } from '../dialogs/pedidos/verPlatos/verPlatos.dialog.component';
import { ModifyStateComponent } from '../dialogs/pedidos/modificarEstado/edit.dialog.component';

@Component({
  templateUrl: './pedidos.component.html',
  styleUrls: ['../app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PedidosComponent implements OnInit {

  displayedColumns = ['id', 'fecha', 'monto', 'estado', 'modificarEstado', 'actions'];
  pedidos: Pedido[];
  dataSource: PedidosDataSource | null;
  pedidoService: PedidosService | null;

  constructor(public httpClient: HttpClient,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    public dataService: PedidosService,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.loadData();
      return;
    }
    this.router.navigate(['/login']);
  }

  refresh() {
    this.loadData();
  }

  startEdit(id: number, fecha: string, monto: number, estado: string, comentario: string) {
    let pedido = new Pedido();
    pedido.estado = estado;
    pedido.id = id;
    pedido.monto = monto;
    pedido.fecha = fecha;
    const dialogRef = this.dialog.open(ModifyStateComponent, {
      data: { estado: estado, id: id }  
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === 1) {
        this.refresh();
      }
    });
  }

  viewDishes(id: number) {
    const dialogRef = this.dialog.open(viewDishesComponent, {
      data: { id: id }
    });
  }

  public loadData() {
    this.pedidoService = new PedidosService(this.httpClient);//, this.changeDetectorRefs);
    this.dataSource = new PedidosDataSource(this.pedidoService, this.paginator, this.sort);
    this.dataSource._sort.direction = "asc";
  }

}

export class Pedido {
  id: number;
  monto: number;
  fecha: string;
  estado: string;
  platos: Plato[]
}

export class Plato {
  nombre: string;
  opciones: string;
  cantidad: number;
  observacion: string;
}


export class PedidosDataSource extends DataSource<Pedido> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  renderedData: Pedido[] = [];

  constructor(public pedidoDatabase: PedidosService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Pedido[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.pedidoDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this.pedidoDatabase.getPedidos();

    return Observable.merge(...displayDataChanges).switchMap(() => {

      // Sort filtered data
      const sortedData = this.sortData(this.pedidoDatabase.data.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      //this._paginator._changePageSize(this._paginator.pageSize); 
      return Observable.of(this.renderedData);
    });
  }
  disconnect() {
  }



  /** Returns a sorted copy of the database data. */
  sortData(data: Pedido[]): Pedido[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number;
      let propertyAA: number;
      let propertyB: number;
      let propertyBB: number;

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'monto': [propertyA, propertyB] = [a.monto, b.monto]; break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      


      return (valueA < valueB ? -1 :1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
