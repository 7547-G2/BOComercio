import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent {
    nombre: string;
    motivo: string;
    estado: string;
    constructor(private router: Router) {
        if(JSON.parse(localStorage.getItem('currentUser'))){
            let currentUser = JSON.parse(localStorage.getItem('currentUser'))    
            this.nombre = currentUser.name
            this.motivo = currentUser.motivoDeshabilitacion
            this.estado = currentUser.estado
        } else {
            this.nombre = ''
            this.motivo = ''
            this.estado = ''
        }
    }
    
    get isLoggedIn() {
        return localStorage.getItem('currentUser');
    }

    goToMenu() {
        this.router.navigate(['/home']);
    }

    goToEditProfile() {
        this.router.navigate(['/editprofile']);
    }

    goToPedidos() {
        this.router.navigate(['/pedidos']);
    }

    goToOpciones() {
        this.router.navigate(['/opciones']);
    }

    goToCategorias() {
        this.router.navigate(['/categorias']);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}