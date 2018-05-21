import { Injectable, ChangeDetectorRef} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { Observable } from 'rxjs/Observable';
import { Pedido, Plato } from '../pedidos';
import { Opcion } from '../models/Opcion';

@Injectable()
export class PedidosPlatosService {

  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api';

  platos: BehaviorSubject<Plato[]> = new BehaviorSubject<Plato[]>([]);

  constructor(private httpClient: HttpClient){}//, private changeDetectorRefs: ChangeDetectorRef) { }

  get data(): Plato[] {
    return this.platos.value;
  }

  getPlatos(id: number): void {
    this.httpClient.get<Plato[]>(this.API_URL + '/backofficeComercio/pedidos/'+id+"/platos").subscribe(data => {
      this.platos.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
    }
}