import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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

@Component({
  templateUrl: './pedidos.component.html',
  styleUrls: ['../app.component.css']
})
export class PedidosComponent implements OnInit {

  displayedColumns = ['id', 'monto', 'fecha', 'estado'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: DataService,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.dataSource.sort = this.sort;
      this.loadData();
      return;
    }
    this.router.navigate(['/login']);
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

}

export interface Pedido {
  id: number;
  monto: number;
  fecha: string;
  estado: string;
}

const ELEMENT_DATA: Pedido[] = [
  {id: 1, monto: 500, fecha: "14/05/2018 21:30", estado: 'Cancelado'},
  {id: 2, monto: 1500, fecha: "14/05/2018 21:31", estado: 'Despachado'},
  {id: 3, monto: 300, fecha: "14/05/2018 21:32", estado: 'Ingresado'},
  {id: 4, monto: 450, fecha: "14/05/2018 21:35", estado: 'Cancelado'},
  {id: 5, monto: 250, fecha: "14/05/2018 21:36", estado: 'Ingresado'},
];