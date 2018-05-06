import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dish } from '../models/Dish';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoComida } from '../models/tipoComida';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
  private readonly API_URL = 'https://hoy-como-backend.herokuapp.com/api/backofficeComercio/' + JSON.parse(localStorage.getItem('currentUser')).comercioId + '/platos';

  dataChange: BehaviorSubject<Dish[]> = new BehaviorSubject<Dish[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  tiposComidas: BehaviorSubject<TipoComida[]> = new BehaviorSubject<TipoComida[]>([]);

  constructor(private httpClient: HttpClient) { }

  get data(): Dish[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllIssues(): void {
    this.httpClient.get<Dish[]>(this.API_URL).subscribe(data => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getTiposDeComida(): Observable<TipoComida[]> {
    console.log("en Get");
    return this.httpClient.get('https://hoy-como-backend.herokuapp.com/api/mobileUser/tipoComida')
      .map((res: any) =>
        <TipoComida[]>res.map(item => {
          console.log(item.tipo);
        return item;
      })
    );
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
    this.httpClient.put(this.API_URL + "/" + kanbanItem.id, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      //this.toasterService.showToaster('Successfully edited', 3000);
    },
      (err: HttpErrorResponse) => {
        //this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
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



/* REAL LIFE CRUD Methods I've used in my projects. ToasterService uses Material Toasts for displaying messages:

    // ADD, POST METHOD
    addItem(kanbanItem: KanbanItem): void {
    this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(kanbanItem: KanbanItem): void {
    this.httpClient.put(this.API_URL + kanbanItem.id, kanbanItem).subscribe(data => {
        this.dialogData = kanbanItem;
        this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(data['']);
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
*/




