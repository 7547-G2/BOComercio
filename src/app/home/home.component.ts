import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { Dish } from '../models/Dish';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import { AddDialogComponent } from '../dialogs/add/add.dialog.component';
import { EditDialogComponent } from '../dialogs/edit/edit.dialog.component';
import { DeleteDialogComponent } from '../dialogs/delete/delete.dialog.component';
import { Injectable } from '@angular/core';
import { TipoComida } from '../models/tipoComida';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../app.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns = ['imagen','description', 'price', 'activo', 'categoria', 'actions', 'orden'];
  exampleDatabase: DataService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  id: number;
  dish: Dish;
  tiposDeComida: TipoComida[];

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: DataService,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true

      this.loadData();
      return;
    }
    this.router.navigate(['/login']);
  }

  refresh() {
    this.loadData();
  }

  addNew(issue: Dish) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { issue: issue }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  increaseOrder(i: number, id: number, imagen: string, nombre: string, precio: number, categoria: number, orden: number) {

    let dishes = this.exampleDatabase.dataChange.value.filter(x => x.orden < orden && x.categoria === categoria);
    if (dishes.length > 0) {
      let maximum = Math.max.apply(Math, dishes.map(function (f) { return f.orden; }));
      let idOrdenAnterior = dishes.find(x => x.orden === maximum && x.categoria === categoria).id;
      let dish = new Dish();
      dish.orden = maximum;
      dish.id = id;
      console.log("maximum:" +maximum);
      this.dataService.updateIssue(dish);
      let dish2 = new Dish();
      dish2.orden = orden;
      dish2.id = idOrdenAnterior;
      console.log("orden:" +orden);
      this.dataService.updateIssue(dish2);
      this.refresh();
    } else {
      alert("No hay un plato de orden mayor para esta categoría.");
    }
  }

  //TODO agregar platoState, cuando este en el get
  startEdit(i: number, id: number, imagen: string, nombre: string, precio: number) {
    this.id = id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { id: id, imagen: imagen, nombre: nombre, precio: precio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, imagen: string, nombre: string, precio: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { id: id, imagen: imagen, nombre: nombre, precio: precio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  // If you don't need a filter or a pagination this can be simplified, you just use code from else block
  private refreshTable() {
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    this.dataSource._sort.direction = "asc";
    this.dataService.getTiposDeComida().subscribe(
      result => { this.tiposDeComida = result; }
    );
  }

  public onChange(value, i: number, id: number, imagen: string, nombre: string, precio: number) {
    this.dish = new Dish();
    this.dish.id = id;
    this.dish.imagen = imagen;
    this.dish.nombre = nombre;
    this.dish.precio = precio;
    this.dish.state = value.checked ? 'ACTIVO' : 'INACTIVO';
    console.log("this.dish.state:" + this.dish.state);
    this.dataService.updateIssue(this.dish);
  }
}




export class ExampleDataSource extends DataSource<Dish> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Dish[] = [];
  renderedData: Dish[] = [];

  constructor(public _exampleDatabase: DataService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Dish[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllIssues();

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((dish: Dish) => {
        var dishStr = (dish != null) ? dish.nombre : "";
        const searchStr = (dishStr).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }
  disconnect() {
  }



  /** Returns a sorted copy of the database data. */
  sortData(data: Dish[]): Dish[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number;
      let propertyAA: number;
      let propertyB: number;
      let propertyBB: number;

      /*switch (this._sort.active) {
        case 'categoria': [propertyA, propertyB] = [a.categoria, b.categoria]; break;
        case 'orden': [propertyA, propertyB] = [a.orden, b.orden]; break;
      }*/
      [propertyA, propertyB] = [a.categoria, b.categoria];
      [propertyAA, propertyBB] = [a.orden, b.orden];
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      const valueAA = isNaN(+propertyAA) ? propertyAA : +propertyAA;
      const valueBB = isNaN(+propertyBB) ? propertyBB : +propertyBB;

      
      
      return (valueA < valueB ? -1 : (valueAA < valueBB ? -1:1))*(this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
