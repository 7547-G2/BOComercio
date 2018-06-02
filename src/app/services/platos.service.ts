import { Injectable, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { Observable } from 'rxjs/Observable';
import { Opcion } from '../models/Opcion';

@Injectable()
export class PlatosService {



  getNuevoEstado(): any {
    return this.nuevoEstado;
  }
  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api';

  dataChange: BehaviorSubject<Dish[]> = new BehaviorSubject<Dish[]>([]);
  // Temporarily stores data from dialogs
  dialogData: Dish;
  nuevoEstado: string;
  tiposComidas: BehaviorSubject<TipoComida[]> = new BehaviorSubject<TipoComida[]>([]);

  constructor(private httpClient: HttpClient) { }//, private changeDetectorRefs: ChangeDetectorRef) { }

  get data(): Dish[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllIssues(): void {
    this.httpClient.get<Dish[]>(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/platos').subscribe(data => {
      this.dataChange.next(data);
      //this.changeDetectorRefs.detectChanges();
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getTiposDeComida(): Observable<TipoComida[]> {
    return this.httpClient.get(this.API_URL + '/backofficeComercio/categoriasComida')
      .map((res: any) =>
        <TipoComida[]>res.map(item => {
          return item;
        })
      );
  }

  updateProfile(comercio: any): void {
    ///api/comercios/{comercioId}
    this.httpClient.put(this.API_URL + '/comercios/' + JSON.parse(localStorage.getItem('currentUser')).comercioId, comercio).subscribe(data => {
      this.dialogData = comercio;
      //this.toasterService.showToaster('Successfully edited', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  getTiposDeComercio(): Observable<TipoComida[]> {
    return this.httpClient.get(this.API_URL + '/mobileUser/tipoComida')
      .map((res: any) =>
        <TipoComida[]>res.map(item => {
          return item;
        })
      );
  }

  getComercio(): any {
    return this.httpClient.get(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId)
      .map(user => { return user; });
  }

  // ADD, POST METHOD
  addIssue(dish: Dish): void {
    dish.state = "INACTIVO";
    this.httpClient.post(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + "/platos", dish).subscribe(data => {
      this.dialogData = dish;
      //this.toasterService.showToaster('Successfully added', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      });
  }

  updateIssue(kanbanItem: Dish): void {
    this.httpClient.put(this.API_URL + "/backofficeComercio/" + JSON.parse(localStorage.getItem('currentUser')).comercioId + "/platos/" + kanbanItem.id, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
    },
      (err: HttpErrorResponse) => {
      }
    );
  }

  deleteIssue(dish: Dish): void {
    dish.state = "BORRADO";
    this.httpClient.put(this.API_URL + "/backofficeComercio/" + JSON.parse(localStorage.getItem('currentUser')).comercioId + "/platos/" + dish.id, dish).subscribe(data => {
      this.dialogData = dish;
      //this.toasterService.showToaster('Successfully edited', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
}
