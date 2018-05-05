import { Routes, RouterModule } from '@angular/router';
 
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { FirstLoginComponent } from './firstLogin/index';
import { EditProfileComponent } from './editProfile/index';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: '', component: LoginComponent },
    { path: 'firstlogin', component: FirstLoginComponent },
    { path: 'editprofile', component: EditProfileComponent },
 
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
 
export const routing = RouterModule.forRoot(appRoutes);