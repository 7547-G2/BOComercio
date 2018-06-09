import { Injectable, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { CategoriaPlatoPost, CategoriaPlato } from '../models/categoriaPlato';
import { Observable } from 'rxjs/Observable';
import { Opcion } from '../models/Opcion';
import { CategoriaConPlatos } from '../categorias/categorias.component';

@Injectable()
export class CategoriaService {



  getDialogData(): any {
    return this.dialogData;
  }
  getNuevoEstado(): any {
    return this.nuevoEstado;
  }
  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api';

  dataChange: BehaviorSubject<CategoriaConPlatos[]> = new BehaviorSubject<CategoriaConPlatos[]>([]);
  // Temporarily stores data from dialogs
  dialogData: CategoriaConPlatos;
  nuevoEstado: string;

  constructor(private httpClient: HttpClient) { }//, private changeDetectorRefs: ChangeDetectorRef) { }

  get data(): CategoriaConPlatos[] {
    return this.dataChange.value;
  }

  getCategoriasFromComercio(): any {
    return this.httpClient.get(this.API_URL + '/backofficeComercio/categoriasComida')
      .map(data => { return data; });
  }

  getMenu(): any {
    return this.httpClient.get<Dish[]>(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/platos')
      .map(data => { return data; });
  }

  getAllCategories(): void {
    this.httpClient.get<CategoriaConPlatos[]>(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/categoriasComida').subscribe(data => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }
  changeStatus(id: number): void {
    this.httpClient.put(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/categoriasComida/'+ id+'/estado',null)
    .subscribe(data => {
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
}


  addCategory(kanbanItem: CategoriaPlatoPost): void {
    console.log(kanbanItem)
    let nuevaCategoria = kanbanItem.tipo//new CategoriaPlatoPost(kanbanItem.id,kanbanItem.tipo,JSON.parse(localStorage.getItem('currentUser')).comercioId);
    this.httpClient.post(this.API_URL  + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/categoriasComida'
      , nuevaCategoria).subscribe(data => {
      //this.toasterService.showToaster('Successfully added', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      });
  }


  editCategory(Categoria: CategoriaConPlatos): void {
    let editedCat = {"estaActivo": Categoria.active, "nombreCategoria": Categoria.tipo};
    this.httpClient.put(this.API_URL  + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/categoriasComida/' + Categoria.id
      , editedCat).subscribe(data => {
        
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      });
      this.dialogData = Categoria;
  }

  swapCategories(Categoria1: CategoriaConPlatos, Categoria2: CategoriaConPlatos): void {
    let editedCat = {
      "firstCategoriaComidaId": Categoria1.id,
      "orderOfFirstCategoria": Categoria1.orderPriority,
      "orderOfSecondCategoria": Categoria2.orderPriority,
      "secondCategoriaComidaId": Categoria2.id
    };
    this.httpClient.put(this.API_URL  + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/categoriasComida/swap'
      , editedCat).subscribe(data => {
        
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      });
  }
}
