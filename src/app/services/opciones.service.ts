import { Injectable, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { Observable } from 'rxjs/Observable';
import { Pedido, Plato } from '../pedidos';
import { Opcion } from '../models/Opcion';

@Injectable()
export class OpcionesService {


  target = [];
  deleteOpcion(opcion: Opcion): void {
    opcion.state = "BORRADO";
    this.httpClient.put(this.API_URL  + '/backofficeComercio/comercio/opcion/' + opcion.id
      , opcion).subscribe(data => {
        
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      });
      this.dialogData = opcion;
  }

  getAllOpciones(): void {
    this.httpClient.get<Opcion[]>(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/opciones').subscribe(data => {
      this.dataChange.next(data);
      //this.changeDetectorRefs.detectChanges();
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }



  getOpciones(): Observable<Opcion[]> {
    return this.httpClient.get(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/opciones')
      .map((res: any) =>
        <Opcion[]>res.map(item => {
          return item;
        })
      );
  }

  updateOpcion(opcion: Opcion): void {
    this.httpClient.put(this.API_URL  + '/backofficeComercio/comercio/opcion/' + opcion.id
      , opcion).subscribe(data => {
        
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      });
      this.dialogData = opcion;
  }

  addOpcion(newOpcion: Opcion): void {
    newOpcion.state = "ACTIVO";
    this.httpClient.post(this.API_URL + '/backofficeComercio/comercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + "/opcion", newOpcion).subscribe(data => {
      this.dialogData = newOpcion;
      //this.toasterService.showToaster('Successfully added', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      });
  }

  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api';

  dataChange: BehaviorSubject<Opcion[]> = new BehaviorSubject<Opcion[]>([]);
  // Temporarily stores data from dialogs
  dialogData: Opcion;
  nuevoEstado: string;

  constructor(private httpClient: HttpClient) { }//, private changeDetectorRefs: ChangeDetectorRef) { }

  get data(): Opcion[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getSelected(){
    return this.target;
  }

  updateDishOptions(selected:any){
    this.target = selected;
  }
}