import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { Dish } from '../models/Dish';
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

@Component({
    templateUrl: './editprofile.component.html',
    styleUrls: ['../app.component.css']
})
export class EditProfileComponent implements OnInit {
    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public dataService: DataService,
        private router: Router) { }


    ngOnInit() {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true

            this.loadData();
            return;
        }
        this.router.navigate(['/login']);
    }


    public loadData() {
        
    }
}