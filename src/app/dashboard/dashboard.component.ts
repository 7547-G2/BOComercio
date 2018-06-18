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
  today = Date.now();
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
    this.dataService.getInfo().subscribe(
      result => {
        this.dashInfo.facturadoDia = result.facturadoDia;
        this.dashInfo.facturadoMes = result.facturadoMes;
        this.dashInfo.feeDelMes = result.facturadoMes*0.01;
        this.dashInfo.pedidosCancelados = result.cancelados;
        this.dashInfo.pedidosIngresados =  result.ingresados;
        this.dashInfo.pedidosEnPreparacion = result.enPreparacion;
        this.dashInfo.pedidosDespachados = result.despachados;
        this.dashInfo.pedidosEntregados = result.entregados;
        this.dashInfo.leadtime = result.leadTime;
        this.dashInfo.rating = result.rating;
        this.dashInfo.cantidadComentarios = result.cantidadComentarios;
      }
    )
  }
}


export class DashBoardInfo {
  cantidadComentarios: number;
  facturadoMes: number;
  facturadoDia: number;
  feeDelMes: number;
  rating: any;
  pedidosIngresados: number;
  pedidosEnPreparacion: number;
  pedidosCancelados: number;
  pedidosDespachados: number;
  pedidosEntregados: number;
  leadtime: number;
}