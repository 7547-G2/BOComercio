import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PlatosService } from '../services/platos.service';
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


@Component({
  templateUrl: './categorias.component.html',
  styleUrls: ['../app.component.css','categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: CategoriaConPlatos[];
  dataSource = new MatTableDataSource();
  displayedColumns = ['id', 'tipo','cantidad','actionsEdit','actions'];

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: PlatosService,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.loadData();
      // this.dataSource.sort = this.sort;
      return;
    }
    this.router.navigate(['/login']);
  }

  refresh() {
    this.loadData();
  }


  addNew(categoria: CategoriaPlato) {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      data: { categoria: categoria }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        // this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        // await new Promise(resolve => setTimeout(()=>resolve(), 1000)).then(()=>console.log("fired"));
        this.refresh();
      }
    });
  }


  startEdit(id: number, tipo: string) {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: {id: id, tipo: tipo}
    });
  }

  viewDishes(dishes:any[]) {
    const dialogRef = this.dialog.open(viewCategoryDishesComponent, {
      data: dishes
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
      // this.filtro = '';
      //this.dataSource.filter = this.filter.nativeElement.value;
    //}
  }

  public loadData() {
    this.dataService.getMenu().subscribe(
      dishes => {
        console.log(dishes)
        this.dataService.getCategoriasFromComercio().subscribe(
          result => {
            this.categorias = result.filter(category => category.comercioId == JSON.parse(localStorage.getItem('currentUser')).comercioId);
            this.categorias.map(function (category) {
              category.platos = [];
              category.cantidadPlatos = 0;
              dishes.map(function (dish) {
                if(category.id == dish.categoria){
                  category.platos.push(dish);
                  category.cantidadPlatos = category.cantidadPlatos + 1
                }
              })
            })
            this.dataSource = new MatTableDataSource(this.categorias);
          }
      );
      }
  );

  }
}

export class CategoriaConPlatos {
  id: number;
  tipo: string;
  cantidadPlatos: number;
  platos: Dish[];
}
