import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {
  MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule,
  MatTableModule, MatToolbarModule,MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import {DataService} from './services/data.service';
import {AuthenticationService} from './services/authentication.service';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { FirstLoginComponent } from './firstLogin/index';
import { EditProfileComponent } from './editProfile/index';
import { routing } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    HomeComponent,
    LoginComponent,
    FirstLoginComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    routing,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyB-rXXfM8eiiWGeC4ZpBpNslVqsea6i1Cw'
    })
  ],
  entryComponents: [
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
  providers: [
    DataService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
