import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OpcionesService } from '../services/opciones.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator } from '@angular/material';
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
import { AddOpcionDialogComponent } from '../dialogs/opciones/add/add.dialog.component';
import { EditOpcionDialogComponent } from '../dialogs/opciones/edit/edit.dialog.component';
import { DeleteOpcionDialogComponent } from '../dialogs/opciones/delete/delete.dialog.component';
import { Injectable } from '@angular/core';
import { TipoComida } from '../models/tipoComida';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Opcion } from '../models/Opcion';

@Component({
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.css']
})
export class OpcionesComponent implements OnInit {

  displayedColumns = ['description', 'price', 'activo','actions'];
  exampleDatabase: OpcionesService | null;
  dataSource: OpcionesDataSource | null;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
    //private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    public dataService: OpcionesService,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;
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

  addNew(issue: Opcion) {
    const dialogRef = this.dialog.open(AddOpcionDialogComponent, {
      data: { issue: issue }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        //this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        //await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>console.log("fired"));
        this.refresh();
      }
    });
  }

  
  //TODO agregar platoState, cuando este en el get
  startEdit(opcion:Opcion) {
    const dialogRef = this.dialog.open(EditOpcionDialogComponent, {
      data: {id: opcion.id,nombre: opcion.nombre,precio:opcion.precio,state:opcion.state}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.find(x => x.id === this.id).orden;
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === opcion.id);
        //console.log("foundIndex: "+foundIndex);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
        //this.dataSource.sortData(this.dataSource._exampleDatabase.data);

        //await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>console.log("fired"));
        //this.refresh();
      }
    });
  }

  deleteItem(i: number, id: number, nombre: string, precio: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteOpcionDialogComponent, {
      data: { id: id, nombre: nombre, precio: precio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        console.log(id + " - " + foundIndex);
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
    this.exampleDatabase = new OpcionesService(this.httpClient);//, this.changeDetectorRefs);
    this.dataSource = new OpcionesDataSource(this.exampleDatabase, this.paginator);//, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    //this.dataSource._sort.direction = "asc";
  }

  public onChange(value,opcion: Opcion) {
    opcion.state = value.checked ? 'ACTIVO' : 'INACTIVO';
    this.dataService.updateOpcion(opcion);
  }
}




export class OpcionesDataSource extends DataSource<Opcion> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Opcion[] = [];
  renderedData: Opcion[] = [];

  constructor(public dataService: OpcionesService,
    public _paginator: MatPaginator){/*,
    public _sort: MatSort) {*/
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Opcion[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.dataService.dataChange,
      //this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this.dataService.getAllOpciones();

    return Observable.merge(...displayDataChanges).switchMap(() => {
      // Filter data
      this.filteredData = this.dataService.data.slice().filter((opcion: Opcion) => {
        var dishStr = (opcion != null) ? opcion.nombre : "";
        const searchStr = (dishStr).toLowerCase();
        console.log("this.filteredData:" + this.filteredData);
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      //const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = this.filteredData.splice(startIndex, this._paginator.pageSize);
      //this._paginator._changePageSize(this._paginator.pageSize); 
      return Observable.of(this.renderedData);
    });
  }
  disconnect() {
  }



  /** Returns a sorted copy of the database data. */
  /*sortData(data: Opcion[]): Opcion[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: string;
      let propertyB: string;

      [propertyA, propertyB] = [a.nombre, b.nombre];
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;



      return (valueA < valueB ? -1 :1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }*/
}
