import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, trigger, state, style, transition, animate } from '@angular/core';
import { PedidosService } from '../services/pedidos.service';
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
import { PlatosService } from '../services/platos.service';
import { ComentariosService } from '../services/comentarios.service';
import { ReplicaDialogComponent } from '../dialogs/replica/replica.dialog.component';
import { Comentario } from '../models/Comentario';

@Component({
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComentariosComponent implements OnInit {
  /*
    id: number;
    usuario: string;
    fecha: string;
    puntaje: number;
    comentario: string;
    replica: string;*/

  displayedColumns = ['id', 'usuario', 'fecha', 'puntaje', 'comentario', 'responder'];
  comentarios: Comentario[];
  dataSource: ComentariosDataSource | null;
  pedidoService: PedidosService | null;
  //platoService: PlatosService;
  comentariosService: ComentariosService | null;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    private router: Router) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      //this.platoService.checkEstadoComercio();
      this.loadData();
      return;
    }
    this.router.navigate(['/login']);
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    //this.pedidoService = new PedidosService(this.httpClient);
    this.comentariosService = new ComentariosService(this.httpClient);
    this.dataSource = new ComentariosDataSource(this.comentariosService, this.paginator, this.sort);
    this.dataSource._sort.direction = "asc";
  }

  //TODO agregar platoState, cuando este en el get
  replicar(comentario: Comentario) {
    const dialogRef = this.dialog.open(ReplicaDialogComponent, {
      data: {
        id: comentario.id, usuario: comentario.usuario, fecha: comentario.fecha,
        puntaje: comentario.puntaje, comentario: comentario.comentario, replica: comentario.replica
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refresh();
      }
    });
  }

}

export class ComentariosDataSource extends DataSource<Comentario> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  filteredData: Comentario[] = [];
  renderedData: Comentario[] = [];

  constructor(public comentariosDatabase: ComentariosService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    this._sort.active = 'id';
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Comentario[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.comentariosDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this.comentariosDatabase.getComentarios();

    return Observable.merge(...displayDataChanges).switchMap(() => {

      let commentData = [];
      // Sort filtered data
      this.filteredData = this.comentariosDatabase.data.slice();
      const sortedData = this.sortData(this.filteredData.slice());

      sortedData.forEach(element => commentData.push(element, { detailRow: true, element }));



      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = commentData.splice(startIndex, this._paginator.pageSize);
      //this._paginator._changePageSize(this._paginator.pageSize); 
      return Observable.of(this.renderedData);
    });
  }
  disconnect() {
  }



  /** Returns a sorted copy of the database data. */
  sortData(data: Comentario[]): Comentario[] {


    this._sort.active = 'id';
    this._sort.direction = "desc";
    return data.sort((a, b) => {
      let propertyA: number;
      let propertyB: number;

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;



      return (valueA < valueB ? 1 : -1);
    });
  }
}
