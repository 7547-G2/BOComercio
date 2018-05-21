import { Injectable, ChangeDetectorRef} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { Observable } from 'rxjs/Observable';
import { Pedido, Plato } from '../pedidos';
import { Opcion } from '../models/Opcion';

@Injectable()
export class PedidosService {


  getNuevoEstado(): any {
    return this.nuevoEstado;
  }
  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api';

  dataChange: BehaviorSubject<Pedido[]> = new BehaviorSubject<Pedido[]>([]);
  platos: BehaviorSubject<Plato[]> = new BehaviorSubject<Plato[]>([]);
  // Temporarily stores data from dialogs
  pedidoModificado: Pedido;
  nuevoEstado: string;
  tiposComidas: BehaviorSubject<TipoComida[]> = new BehaviorSubject<TipoComida[]>([]);

  constructor(private httpClient: HttpClient){}//, private changeDetectorRefs: ChangeDetectorRef) { }

  get data(): Pedido[] {
    return this.dataChange.value;
  }

  getPedidoModificadoData() {
    return this.pedidoModificado;
  }

 
  getPedidos(): Pedido[] {/*
    return Observable.of(this.ELEMENT_DATA).map((res: any) =>
    <Pedido[]>res.map(item => {
      return item;
    })
  );*/
  this.httpClient.get<Pedido[]>(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/pedidos').subscribe(data => {
    this.dataChange.next(data);
    //this.changeDetectorRefs.detectChanges();
  },
    (error: HttpErrorResponse) => {
      console.log(error.name + ' ' + error.message);
    });
    return this.dataChange.value;
  }

  getPlatos(id: number): Observable<Plato[]> {
    /*return Observable.of(this.dataChange.value.find(x => x.id == id)).map((res: any) =>
    <Plato[]>res.platos);
*/
    this.httpClient.get<Plato[]>(this.API_URL + '/backofficeComercio/pedidos/'+id+"/platos").subscribe(data => {
      this.platos.next(data);
      //this.changeDetectorRefs.detectChanges();
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
      return this.platos;
    }
  
  
  updatePedido(pedido: Pedido): void {
    this.pedidoModificado = pedido;
    this.nuevoEstado = pedido.estado;
    this.httpClient.put(this.API_URL + "/backofficeComercio/pedidos/" +pedido.id, pedido.estado).subscribe(data => {
      
    },
      (err: HttpErrorResponse) => {
      }
    );
  }
}