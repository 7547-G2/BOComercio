import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services/data.service';
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

@Component({
  templateUrl: './pedidos.component.html',
  styleUrls: ['../app.component.css']
})
export class PedidosComponent implements OnInit {

  displayedColumns = ['id', 'fecha', 'monto', 'estado', 'modificarEstado', 'comentario','actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: DataService,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.loadData();
      this.dataSource.sort = this.sort;
      return;
    }
    this.router.navigate(['/login']);
  }

  refresh() {
    this.loadData();
  }

  startEdit(id: number, fecha: string, monto: number, estado: string,comentario: string) {
    let pedido = new Pedido();
    pedido.estado = estado;
    pedido.id = id;
    pedido.monto = monto;
    pedido.fecha = fecha;
    pedido.comentario = comentario;
    const dialogRef = this.dialog.open(PedidosComponent, {
      data: { estado: estado }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.dataSource.data.findIndex(x => x.id === id);
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        //console.log("foundIndex: "+foundIndex);
        // Then you update that record using data from dialogData (values you enetered)
        pedido.estado = this.dataService.getNuevoEstado();
        this.dataSource.data[foundIndex] = pedido;//this.dataService.getPedidoModificadoData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  viewDishes(dishes:any[]) {
    const dialogRef = this.dialog.open(viewDishesComponent, {
      data: { dishes: dishes }
    });
  }

  // If you don't need a filter or a pagination this can be simplified, you just use code from else block
  private refreshTable() {
    // if there's a paginator active we're using it for refresh
    /*if (this.dataSource.paginator.hasNextPage()) {
      this.dataSource.paginator.nextPage();
      this.dataSource.paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource.paginator.hasPreviousPage()) {
      this.dataSource.paginator.previousPage();
      this.dataSource.paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {*/
      this.dataSource.filter = '';
      //this.dataSource.filter = this.filter.nativeElement.value;
    //}
  }


  public loadData() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

}

export class Pedido {
  id: number;
  monto: number;
  fecha: string;
  estado: string;
  comentario: string;
  platos:any[]
}

const ELEMENT_DATA: Pedido[] = [
  { id: 1, fecha: "14/05/2018 21:30", monto: 500, estado: 'Cancelado',comentario:'Todos los platos sin sal',platos:[{"Plato":"Pizza de Muzarella","opciones":"Al molde","cantidad":1},{"Plato":"Docena Empanadas Carne Cuchillo","opciones":"","cantidad":1}]},
  { id: 2, fecha: "14/05/2018 21:31", monto: 1500, estado: 'Despachado',comentario:'',platos:[{"Plato":"Pizza de Muzarella","opciones":"Al molde","cantidad":1},{"Plato":"Docena Empanadas Carne Cuchillo","opciones":"","cantidad":1}]},
  { id: 3, fecha: "14/05/2018 21:33", monto: 300, estado: 'Ingresado',comentario:'',platos:[{"Plato":"Pizza de Muzarella","opciones":"Al molde","cantidad":1}]},
  { id: 4, fecha: "14/05/2018 21:35", monto: 450, estado: 'Cancelado',comentario:'',platos:[{"Plato":"Docena Empanadas Carne Cuchillo","opciones":"","cantidad":1}]},
  { id: 5, fecha: "14/05/2018 21:41", monto: 250, estado: 'Ingresado',comentario:'La pizza de muzzarella con extra queso',platos:[{"Plato":"Docena Empanadas Carne Cuchillo","opciones":"","cantidad":1}]},
];