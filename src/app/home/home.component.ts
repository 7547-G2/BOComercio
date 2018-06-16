import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PlatosService } from '../services/platos.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { Dish } from '../models/Dish';
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
import { AddDialogComponent } from '../dialogs/add/add.dialog.component';
import { EditDialogComponent } from '../dialogs/edit/edit.dialog.component';
import { DeleteDialogComponent } from '../dialogs/delete/delete.dialog.component';
import { Injectable } from '@angular/core';
import { TipoComida } from '../models/tipoComida';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ManageOpcionesDialogComponent } from '../dialogs/manageOpciones/manageOpciones.dialog.component';
import { OpcionesService } from '../services/opciones.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns = ['imagen', 'description', 'price', 'activo', 'categoria', 'actions','orden'];
  exampleDatabase: PlatosService | null;
  dataSource: ExampleDataSource | null;
  tiposDeComida: TipoComida[];

  constructor(public httpClient: HttpClient,
    //private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    public dataService: PlatosService,
    public opcionesService: OpcionesService,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      this.loadData();
      this.dataService.checkEstadoComercio();
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
        this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  increaseOrder(dish: Dish) {

    let dishes = this.exampleDatabase.dataChange.value.filter(x => x.orden < dish.orden && x.categoria === dish.categoria);
    if (dishes.length > 0) {
      let maximum = Math.max.apply(Math, dishes.map(function (f) { return f.orden; }));
      let dishPrevio = dishes.find(x => x.orden === maximum && x.categoria === dish.categoria);
      dishPrevio.orden = dish.orden;
      dish.orden = maximum;
      this.dataService.updateIssue(dish);

      //await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>console.log("fired"));


      this.dataService.updateIssue(dishPrevio);
      //await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>console.log("fired"));

      const IndexDish = this.exampleDatabase.dataChange.value.findIndex(x => x.id === dish.id);
      const IndexDishPrevio = this.exampleDatabase.dataChange.value.findIndex(x => x.id === dishPrevio.id);
      //console.log("foundIndex: "+foundIndex);
      // Then you update that record using data from dialogData (values you enetered)
      this.exampleDatabase.dataChange.value[IndexDish] = dishPrevio;
      this.exampleDatabase.dataChange.value[IndexDishPrevio] = dish;
      // And lastly refresh table
      this.refreshTable();

      /*let dish = new Dish();
        dish.id = id;
        dish.orden = maximum;
        console.log("maximum: " +maximum);
        this.dataService.updateIssue(dish);
  
        await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>console.log("fired"));
        let dish2 = new Dish();
        dish2.id = dishPrevio;
        dish2.orden = orden;
        console.log("orden: " +orden);
        this.dataService.updateIssue(dish2);
        await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>console.log("fired"));
        this.refresh();*/
    } else {
      alert("No hay un plato de orden mayor para esta categoría.");
    }
  }

  decreaseOrder(dish: Dish) {

    let dishes = this.exampleDatabase.dataChange.value.filter(x => x.orden > dish.orden && x.categoria === dish.categoria);
    if (dishes.length > 0) {
      let maximum = Math.min.apply(Math, dishes.map(function (f) { return f.orden; }));
      let dishPrevio = dishes.find(x => x.orden === maximum && x.categoria === dish.categoria);

      dishPrevio.orden = dish.orden;
      dish.orden = maximum;
      this.dataService.updateIssue(dish);

      this.dataService.updateIssue(dishPrevio);
      const IndexDish = this.exampleDatabase.dataChange.value.findIndex(x => x.id === dish.id);
      const IndexDishPrevio = this.exampleDatabase.dataChange.value.findIndex(x => x.id === dishPrevio.id);
      //console.log("foundIndex: "+foundIndex);
      // Then you update that record using data from dialogData (values you enetered)
      this.exampleDatabase.dataChange.value[IndexDish] = dishPrevio;
      this.exampleDatabase.dataChange.value[IndexDishPrevio] = dish;
      this.refreshTable();
    } else {
      alert("No hay un plato de orden menor para esta categoría.");
    }
  }

  //TODO agregar platoState, cuando este en el get
  startEdit(issue: Dish) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { issue: issue }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === issue.id);
        //console.log("foundIndex: "+foundIndex);
        // Then you update that record using data from dialogData (values you enetered)
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === dish.id);
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        //this.refreshTable();
        //this.dataSource.sortData(this.dataSource._exampleDatabase.data);
        this.refreshTable();
      }
    });
  }


  //TODO agregar platoState, cuando este en el get
  openOptions(dish: Dish) {
    const dialogRef = this.dialog.open(ManageOpcionesDialogComponent, {
      data: dish
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.find(x => x.id === this.id).orden;
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        //this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        let target = [];
        target = this.opcionesService.getSelected();
        dish.opcionalIds = target.map(function (a) { return a["id"]; });
        this.dataService.updateIssue(dish);
        //this.dataSource.sortData(this.dataSource._exampleDatabase.data);
        //this.refresh();
      }
    });
  }

  deleteItem(i: number, id: number, imagen: string, nombre: string, precio: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { id: id, imagen: imagen, nombre: nombre, precio: precio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === id);
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
    this.exampleDatabase = new PlatosService(this.httpClient);//, this.changeDetectorRefs);
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
  }

  public onChange(value, dish: Dish) {
    dish.state = value.checked ? 'ACTIVO' : 'INACTIVO';
    this.dataService.updateIssue(dish);
    console.log(dish.state);
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

  constructor(public _exampleDatabase: PlatosService,
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

    return Observable.merge(...displayDataChanges).switchMap(() => {
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
      //this._paginator._changePageSize(this._paginator.pageSize); 
      return Observable.of(this.renderedData);
    });
  }
  disconnect() {
  }



  /** Returns a sorted copy of the database data. */
  sortData(data: Dish[]): Dish[] {

    this._sort.active = 'categoria';
    this._sort.direction = "asc";
    return data.sort((a, b) => {
      let propertyA: number;
      let propertyAA: number;
      let propertyB: number;
      let propertyBB: number;


      [propertyA, propertyB] = [a.categoria, b.categoria];
      [propertyAA, propertyBB] = [a.orden, b.orden];
      /*const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      const valueAA = isNaN(+propertyAA) ? propertyAA : +propertyAA;
      const valueBB = isNaN(+propertyBB) ? propertyBB : +propertyBB;
*/


      return ((propertyA == propertyB) ? (propertyAA < propertyBB ? -1 : 1) :
        ((propertyA < propertyB) ? -1 : 1));
    });
  }
}
