import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
 
import { AuthenticationService } from '../services/authentication.service';
 
@Component({
    moduleId: module.id,
    templateUrl: 'firstlogin.component.html'
})
 
export class FirstLoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    email: string;
    hash: string;
 
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService) { }
 
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
 
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.email = this.route.snapshot.queryParams['email'];
        this.hash = this.route.snapshot.queryParams['hash'];
    }
 
    firstlogin() {
        this.loading = true;
        this.authenticationService.firstlogin(this.email, this.model.password,this.hash)
            .subscribe(
                data => {
                    this.router.navigate(['/home']);
                },
                error => {
                    this.loading = false;
                    this.model.error = "error";
                });
    }
}