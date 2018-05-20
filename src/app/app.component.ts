import { Component } from '@angular/core';
import { Router} from '@angular/router';
@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent {

    constructor(private router: Router) {}
    get isLoggedIn() {
        return localStorage.getItem('currentUser');
    }

    goToMenu(){
        this.router.navigate(['/home']);
    }

    goToEditProfile(){
        this.router.navigate(['/editprofile']);
    }

    goToPedidos(){
        this.router.navigate(['/pedidos']);
    }

    goToOpciones(){
        this.router.navigate(['/opciones']);
    }

    goToCategorias(){
        this.router.navigate(['/categorias']);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}