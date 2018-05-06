import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
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
import { MouseEvent } from '@agm/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    templateUrl: './editprofile.component.html',
    styleUrls: ['../app.component.css']
})
export class EditProfileComponent implements OnInit {
    comercio: any = {};
    tiposDeComida: TipoComida[];
    comercioId:number;
    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public dataService: DataService,
        private authenticationService: AuthenticationService,
        private router: Router) { }


    // google maps zoom level
    zoom: number = 1000;

    // initial center position for the map
    lat: number = -34.6175283;
    lng: number = -58.3683175;


    ngOnInit() {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true

            this.loadData();
            return;
        }
        this.router.navigate(['/login']);
    }

    public loadData() {
        this.dataService.getComercio().subscribe(
            result => {this.comercio = result;}
        );
        this.dataService.getTiposDeComida().subscribe(
            result => {this.tiposDeComida = result;}
        );
    }
}