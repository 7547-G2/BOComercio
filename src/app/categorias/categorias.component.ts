import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { viewCategoryDishesComponent } from '../dialogs/categorias/verPlatos/viewCategoryDishes.dialog.component';
import { EditCategoryDialogComponent } from '../dialogs/categorias/edit/editCategory.dialog.component';
import { AddCategoryDialogComponent } from '../dialogs/addCategory/addCategory.dialog.component';
import { Dish } from '../models/Dish';
import { CategoriaPlato } from '../models/categoriaPlato';
import { CategoriaService } from '../services/categorias.service';
import { PlatosService } from '../services/platos.service';
//import { PlatosService } from '../services/platos.service';


@Component({
  templateUrl: './categorias.component.html',
  styleUrls: ['categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: CategoriaConPlatos[];
  displayedColumns = ['orderPriority', 'tipo', /*'cantidad',*/ 'activo', 'actionsEdit', 'actions'];
  categoriaDatabase: CategoriaService | null;
  dataSource: CategoriaDataSource | null;


  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: CategoriaService,
    //public platoService: PlatosService,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      //this.platoService.checkEstadoComercio();
      this.loadData();
      return;
    }
    this.router.navigate(['/login']);
  }

  public onChange(value, id: number) {
    this.dataService.changeStatus(id);
  }


  refresh() {
    this.loadData();
  }


  addNew(categoria: CategoriaPlato) {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      data: { categoria: categoria }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        // this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        // await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>console.log("fired"));
        this.refresh();
      }
    });
  }


  startEdit(cat: CategoriaConPlatos) {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: { id: cat.id, tipo: cat.tipo, active: cat.active, orderPriority: cat.orderPriority }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.categoriaDatabase.dataChange.value.findIndex(x => x.id === cat.id);
        this.categoriaDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  increaseOrder(categoria:CategoriaConPlatos) {

    let categorias = this.categoriaDatabase.dataChange.value.filter(x => x.orderPriority < categoria.orderPriority);
    if (categorias.length > 0) {
      let maximum = Math.max.apply(Math, categorias.map(function (f) { return f.orderPriority; }));
      let catPrevia = categorias.find(x => x.orderPriority === maximum);

      //const IndexCategoria = this.categoriaDatabase.dataChange.value.findIndex(x => x.id === categoria.id);
      //const IndexCatPrevia = this.categoriaDatabase.dataChange.value.findIndex(x => x.id === catPrevia.id);
      this.dataService.swapCategories(categoria, catPrevia);
        //console.log("foundIndex: "+foundIndex);
        // Then you update that record using data from dialogData (values you enetered)
      //this.categoriaDatabase.dataChange.value[IndexCategoria] = catPrevia;
      //this.categoriaDatabase.dataChange.value[IndexCatPrevia] = categoria;
        // And lastly refresh table
        this.refresh();
      
    } else {
      alert("No hay una categoría de orden mayor.");
    }
  }

  decreaseOrder(categoria:CategoriaConPlatos) {

    let categorias = this.categoriaDatabase.dataChange.value.filter(x => x.orderPriority > categoria.orderPriority);
    if (categorias.length > 0) {
      let min = Math.min.apply(Math, categorias.map(function (f) { return f.orderPriority; }));
      let catPrevia = categorias.find(x => x.orderPriority === min);
      this.dataService.swapCategories(categoria, catPrevia);

      //const IndexCategoria = this.categoriaDatabase.dataChange.value.findIndex(x => x.id === categoria.id);
      //const IndexCatPrevia = this.categoriaDatabase.dataChange.value.findIndex(x => x.id === catPrevia.id);
        //console.log("foundIndex: "+foundIndex);
        // Then you update that record using data from dialogData (values you enetered)
      //this.categoriaDatabase.dataChange.value[IndexCategoria] = catPrevia;
      //this.categoriaDatabase.dataChange.value[IndexCatPrevia] = categoria;
        // And lastly refresh table
        this.refresh();
      
    } else {
      alert("No hay una categoría de orden menor.");
    }
  }


  viewDishes(dishes: any[]) {
    const dialogRef = this.dialog.open(viewCategoryDishesComponent, {
      data: dishes
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
    this.categoriaDatabase = new CategoriaService(this.httpClient);//, this.changeDetectorRefs);
    this.dataSource = new CategoriaDataSource(this.categoriaDatabase, this.paginator, this.sort);
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
}

export class CategoriaConPlatos {
  id: number;
  tipo: string;
  //cantidadPlatos: number;
  //platos: Dish[];
  active: boolean;
  orderPriority: number;
}


export class CategoriaDataSource extends DataSource<CategoriaConPlatos> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: CategoriaConPlatos[] = [];
  renderedData: CategoriaConPlatos[] = [];

  constructor(public _categoriaDatabase: CategoriaService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<CategoriaConPlatos[]> {
    const displayDataChanges = [
      this._categoriaDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._categoriaDatabase.getAllCategories();



    return Observable.merge(...displayDataChanges).switchMap(() => {
      // Filter data
      this.filteredData = this._categoriaDatabase.data.slice().filter((catergoria: CategoriaConPlatos) => {
        var catStr = (catergoria != null) ? catergoria.tipo : "";
        const searchStr = (catStr).toLowerCase();
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



  sortData(data: CategoriaConPlatos[]): CategoriaConPlatos[] {

    this._sort.active = 'orderPriority';
    this._sort.direction = "asc";
    return data.sort((a, b) => {
      let propertyA: number;
      let propertyB: number;


      [propertyA, propertyB] = [a.orderPriority, b.orderPriority];
      return (propertyA < propertyB) ? -1 : 1;
    });
  }
}