import { Component, OnInit } from '@angular/core';
import { DashBoardService } from '../services/dashboard.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PlatosService } from '../services/platos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  starList = [];
  conDecimal: boolean;
  dashInfo: DashBoardInfo = new DashBoardInfo();
  //platoService: PlatosService = new PlatosService(this.httpClient);

  constructor(public httpClient: HttpClient,
    public dataService: DashBoardService,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.loadData();
      //this.platoService.checkEstadoComercio();
      return;
    }
    this.router.navigate(['/login']);
  }

  refresh() {
    this.loadData();
  }

  setStar(data:any){                              
    for(var i=0;i<=4;i++){  
      if(i<=data){  
        this.starList[i]=false;  
      }  
      else{  
        this.starList[i]=true;  
      }  
   }  
}  

  public loadData() {
    this.dataService.getPedidos().subscribe(
      result => {
        this.dashInfo.pedidosCancelados = result.filter(x => x.estado == "Cancelado").length;
        this.dashInfo.pedidosIngresados =  result.filter(x => x.estado == "Ingresado").length;
        this.dashInfo.pedidosEnPreparacion = result.filter(x => x.estado == "EnPreparacion").length;
        this.dashInfo.pedidosDespachados = result.filter(x => x.estado == "Despachado").length;
        this.dashInfo.pedidosEntregados = result.filter(x => x.estado == "Entregado").length;
      }
    );
    this.dataService.getLeadTime().subscribe(
      result => {
        this.dashInfo.leadtime = result[0].leadTime;
        this.dashInfo.rating = Math.floor(result[0].rating);
        this.setStar(this.dashInfo.rating);
        this.conDecimal = result[0].rating > this.dashInfo.rating;
      }
    )
  }
}


export class DashBoardInfo {
  rating: any;
  pedidosIngresados: number;
  pedidosEnPreparacion: number;
  pedidosCancelados: number;
  pedidosDespachados: number;
  pedidosEntregados: number;
  leadtime: number;
}