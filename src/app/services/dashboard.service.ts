import { Injectable, ChangeDetectorRef} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { Observable } from 'rxjs/Observable';
import { Pedido, Plato } from '../pedidos';
import { Opcion } from '../models/Opcion';

@Injectable()
export class DashBoardService {

  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api';


  constructor(private httpClient: HttpClient){}//, private changeDetectorRefs: ChangeDetectorRef) { }

  getPedidos(): any {
    return this.httpClient.get(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/pedidos')
      .map(data => { return data; });
  }

  getLeadTime(): any {
    return this.httpClient.get(this.API_URL + '/mobileUser/comercios?search=id:' + JSON.parse(localStorage.getItem('currentUser')).comercioId)
      .map(data => { return data; });
  }
}