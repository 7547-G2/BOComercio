import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { User } from '../models/user'
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthenticationService {
    private habilitado = new BehaviorSubject<boolean>(false); // {1}

    get isHabilitado() {
      return this.habilitado.asObservable(); // {2}
    }

    firstlogin(username: string, password: string, hash: string) {
        return this.http.put('https://hoy-como-backend.herokuapp.com/api/backofficeComercio/passwordUpdate',
            { email: username, newPassword: password, oldPassword: hash })
            .map(user => {
                // login successful if there's a jwt token in the response
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    //this.habilitado.next(true);
                }

            })
            .catch((error: any) => {        
                return Observable.throw(error.data.errorMessage);
            });
    }
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>('https://hoy-como-backend.herokuapp.com/api/backofficeComercio/session', { email: username, password: password })
            .map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    console.log(user.motivoDeshabilitacion);
                    //this.habilitado.next(typeof user.motivoDeshabilitacion!='undefined' && user.motivoDeshabilitacion);
                    localStorage.setItem('estadoComercio', JSON.stringify(user.estadoComercio));
                }
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}