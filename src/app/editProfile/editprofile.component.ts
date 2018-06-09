import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlatosService } from '../services/platos.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TipoComida } from '../models/tipoComida';
import { Comercio } from '../models/Comercio';
import { Address } from '../models/Address';
import { MouseEvent } from '@agm/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    templateUrl: './editprofile.component.html',
    styleUrls: ['../app.component.css']
})
export class EditProfileComponent implements OnInit {
    comercio: Comercio = new Comercio();
    tiposDeComida: TipoComida[];
    descuentoControl = new FormControl("", [Validators.max(100), Validators.min(0)])
    comercioId:number;
    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public dataService: PlatosService,
        private authenticationService: AuthenticationService,
        private router: Router) { }


    // google maps zoom level
    zoom: number = 1000;

    ngOnInit() {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true

            this.loadData();
            return;
        }
        this.router.navigate(['/login']);
    }

    updateProfile(){
        this.dataService.updateProfile(this.comercio);
        alert("Los cambios han sido guardados exitosamente.");        
    }

    changeListener($event,imagen:string) : void {
        this.readThis($event.target, true);
      }

      changeImagenComercio($event,imagen:string) : void {
        this.readThis($event.target, false);
      }

      
      
      readThis(inputValue: any, esLogo:boolean): void {
        var file:File = inputValue.files[0];
        if(file.size > 524288){
          alert("La imagen no debe pesar más de 512Kb");
          inputValue.value = "";
          return;
        };
        var myReader:FileReader = new FileReader();
      
        myReader.onload = (e) => {
          var img = new Image();
          var w = img.width;
          var h = img.height;
          if (h!=w && esLogo){
            alert("La imagen debe ser cuadrada");
            inputValue.value = "";
            return;
          }
          img.src = myReader.result;
        }
    
        myReader.onloadend = (e) => {
            if (esLogo){
                this.comercio.imagenLogo = myReader.result;
            } else {
                this.comercio.imagenComercio = myReader.result;
            }
        }
        myReader.readAsDataURL(file);
      }  
    

    public loadData() {
        this.dataService.getComercio().subscribe(
            result => {this.comercio = result;}
        );
        this.dataService.getTiposDeComercio().subscribe(
            result => {this.tiposDeComida = result;}
        );
    }

    goBack(){
        alert("volver");
        this.router.navigate(['/home']);
    }
}