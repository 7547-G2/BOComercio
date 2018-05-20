import { Injectable, ChangeDetectorRef} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { Observable } from 'rxjs/Observable';
import { Pedido, Plato } from '../pedidos';
import { Opcion } from '../models/Opcion';

@Injectable()
export class DataService {


  deleteOpcion(opcion: Opcion): void {
    opcion.state = "BORRADO";
    /*this.httpClient.put(this.API_URL + "/" + dish.id, dish).subscribe(data => {
      this.dialogData = dish;
      //this.toasterService.showToaster('Successfully edited', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );*/
    
  }
  OPCIONES: Opcion[] = [
    { id: 1, nombre: "Al molde", precio: 0, state: 'ACTIVO'},
    { id: 2, nombre: "A la piedra", precio: 0, state: 'ACTIVO'},
  ];


  getAllOpciones(): Opcion[] {
    return this.OPCIONES;/*Observable.of(this.OPCIONES).map((res: any) =>
    <Opcion[]>res.map(item => {
      return item;
    })
  );*/
  }

 
  updateOpcion(opcion: Opcion): Opcion {
    return opcion;
  }
  addOpcion(newOpcion: Opcion): Opcion {
    return newOpcion;
  }
  getNuevoEstado(): any {
    return this.nuevoEstado;
  }
  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api';

  dataChange: BehaviorSubject<Dish[]> = new BehaviorSubject<Dish[]>([]);
  // Temporarily stores data from dialogs
  dialogData: Dish;
  pedidoModificado: Pedido;
  nuevoEstado: string;
  tiposComidas: BehaviorSubject<TipoComida[]> = new BehaviorSubject<TipoComida[]>([]);

  constructor(private httpClient: HttpClient){}//, private changeDetectorRefs: ChangeDetectorRef) { }

  get data(): Dish[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getPedidoModificadoData() {
    return this.pedidoModificado;
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

  updateProfile(comercio : any): void {
    ///api/comercios/{comercioId}
    this.httpClient.put(this.API_URL + '/api/comercios/' + JSON.parse(localStorage.getItem('currentUser')).comercioId, comercio).subscribe(data => {
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



  ELEMENT_DATA: Pedido[] = [
    { id: 1, fecha: "14/05/2018 21:30", monto: 500, estado: 'Cancelado',platos:[{"plato":"Pizza de Muzarella","opciones":"Al molde","cantidad":1,"observacion":""},{"plato":"Docena Empanadas Carne Cuchillo","opciones":"","cantidad":1,"observacion":""}]},
    { id: 2, fecha: "14/05/2018 21:31", monto: 1500, estado: 'Despachado',platos:[{"plato":"Pizza de Muzarella","opciones":"Al molde","cantidad":2,"observacion":""},{"plato":"Docena Empanadas Carne Cuchillo","opciones":"","cantidad":2,"observacion":""}]},
    { id: 3, fecha: "14/05/2018 21:33", monto: 300, estado: 'Ingresado',platos:[{"plato":"Pizza de Muzarella","opciones":"Al molde","cantidad":3,"observacion":""}]},
    { id: 4, fecha: "14/05/2018 21:35", monto: 450, estado: 'Cancelado',platos:[{"plato":"Docena Empanadas Carne Cuchillo","opciones":"","cantidad":4,"observacion":""}]},
    { id: 5, fecha: "14/05/2018 21:41", monto: 250, estado: 'Ingresado',platos:[{"plato":"Docena Empanadas Carne Cuchillo","opciones":"","cantidad":5,"observacion":"Sin huevos, ni aceitunas, ni nada de esas cosas asquerosas que ustedes suelen ponerle a las empanadas. Entendieron?"}]},
  ];


  getPedidos(): Observable<Pedido[]> {
    return Observable.of(this.ELEMENT_DATA).map((res: any) =>
    <Pedido[]>res.map(item => {
      return item;
    })
  );
  }

  getPlatos(id: number): Observable<Plato[]> {
    return Observable.of(this.ELEMENT_DATA.find(x => x.id == id)).map((res: any) =>
    <Plato[]>res.platos);
  }

  getComercio(): any {
    return this.httpClient.get(this.API_URL + '/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId)
      .map(user => { return user; });
  }

  // ADD, POST METHOD
  addIssue(kanbanItem: Dish): void {
    kanbanItem.state = "INACTIVO";
    this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      //this.toasterService.showToaster('Successfully added', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      });
  }

  updateIssue(kanbanItem: Dish): void {
    this.httpClient.put(this.API_URL + "/backofficeComercio/" + JSON.parse(localStorage.getItem('currentUser')).comercioId +"/platos/" + kanbanItem.id, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
    },
      (err: HttpErrorResponse) => {
      }
    );
  }

  updatePedido(pedido: Pedido): void {
    this.pedidoModificado = pedido;
    this.nuevoEstado = pedido.estado;
  }

  deleteIssue(dish: Dish): void {
    dish.state = "BORRADO";
    this.httpClient.put(this.API_URL + "/" + dish.id, dish).subscribe(data => {
      this.dialogData = dish;
      //this.toasterService.showToaster('Successfully edited', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
}