import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { FirstLoginComponent } from './firstLogin/index';
import { EditProfileComponent } from './editProfile/index';
import { PedidosComponent } from './pedidos/index';
import { OpcionesComponent } from './opciones/index'
import { CategoriasComponent } from './categorias/index';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComentariosComponent } from './comentarios/index';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', component: LoginComponent },
    { path: 'firstlogin', component: FirstLoginComponent },
    { path: 'editprofile', component: EditProfileComponent },
    { path: 'pedidos', component: PedidosComponent },
    { path: 'opciones', component: OpcionesComponent },
    { path: 'categorias', component: CategoriasComponent },
    // otherwise redirect to login
    { path: 'dashboard', component: DashboardComponent },
    { path: 'comentarios', component: ComentariosComponent },
 
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);