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
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },// canActivate: [AuthGuard]},
    { path: '', component: LoginComponent  },//canActivate: [AuthGuard]},
    { path: 'firstlogin', component: FirstLoginComponent },// canActivate: [AuthGuard]},
    { path: 'editprofile', component: EditProfileComponent  },//canActivate: [AuthGuard]},
    { path: 'pedidos', component: PedidosComponent  },//canActivate: [AuthGuard]},
    { path: 'opciones', component: OpcionesComponent  },//canActivate: [AuthGuard]},
    { path: 'categorias', component: CategoriasComponent  },// canActivate: [AuthGuard]},
    { path: 'dashboard', component: DashboardComponent  },//canActivate: [AuthGuard]},
    { path: 'comentarios', component: ComentariosComponent  },// canActivate: [AuthGuard]},
 
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);