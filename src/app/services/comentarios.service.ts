import { Injectable, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { Observable } from 'rxjs/Observable';
import { Comentario } from '../comentarios';

@Injectable()
export class ComentariosService {

  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api';

  dataChange: BehaviorSubject<Comentario[]> = new BehaviorSubject<Comentario[]>([]);

  constructor(private httpClient: HttpClient) { }

  get data(): Comentario[] {
    return this.dataChange.value;
  }

  getComentarios(): void {
    /*this.httpClient.get<Comentario[]>(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/pedidos').subscribe(data => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
      });*/
  }

  updatePedido(comentario: Comentario): void {
    /*this.httpClient.put(this.API_URL + "/backofficeComercio/pedidos/" + pedido.id, pedido.estado).subscribe(data => {
    },
      (err: HttpErrorResponse) => {
      }
    );*/
  }
}