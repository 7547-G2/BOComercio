import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { User } from '../models/user'

@Injectable()
export class AuthenticationService {
    firstlogin(username: string, password: string, hash: string) {
        return this.http.put('https://hoy-como-backend.herokuapp.com/api/backofficeComercio/passwordUpdate',
            { email: username, newPassword: password, oldPassword: hash })
            .map(user => {
                // login successful if there's a jwt token in the response
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

            })
            .catch((error: any) => {        
                console.log("data: " + error.data.errorMessage);
                return Observable.throw(error.data.errorMessage);
            });
    }
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>('https://hoy-como-backend.herokuapp.com/api/backofficeComercio/session', { email: username, password: password })
            .map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    console.log(user)
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}