import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {
  MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule,
  MatTableModule, MatToolbarModule, MatSliderModule, MatSlideToggleModule, MatFormFieldModule,
  MatRadioModule
} from '@angular/material';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { OpcionesService } from './services/opciones.service';
import { PlatosService } from './services/platos.service';
import { AuthenticationService } from './services/authentication.service';
import { AddDialogComponent } from './dialogs/add/add.dialog.component';
import { EditCategoryDialogComponent } from './dialogs/categorias/edit/editCategory.dialog.component';
import { EditDialogComponent } from './dialogs/edit/edit.dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.dialog.component';
import { AddOpcionDialogComponent } from './dialogs/opciones/add/add.dialog.component';
import { EditOpcionDialogComponent } from './dialogs/opciones/edit/edit.dialog.component';
import { DeleteOpcionDialogComponent } from './dialogs/opciones/delete/delete.dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { FirstLoginComponent } from './firstLogin/index';
import { EditProfileComponent } from './editProfile/index';
import { PedidosComponent } from './pedidos/index'
import { ModifyStateComponent } from './dialogs/pedidos/modificarEstado/edit.dialog.component';
import { viewDishesComponent } from './dialogs/pedidos/verPlatos/verPlatos.dialog.component';
import { routing } from './app.routing';
import { OpcionesComponent } from './opciones';
import { PedidosService } from './services/pedidos.service';
import { PedidosPlatosService } from './services/pedidosPlatos.service';
import { AddCategoryDialogComponent } from './dialogs/addCategory/addCategory.dialog.component';
import { CategoriasComponent } from './categorias/index';
import { viewCategoryDishesComponent } from './dialogs/categorias/verPlatos/viewCategoryDishes.dialog.component';
import { ManageOpcionesDialogComponent } from './dialogs/manageOpciones/manageOpciones.dialog.component';
import { CategoriaService } from './services/categorias.service';

@NgModule({
  declarations: [
    AppComponent,
    AddDialogComponent,
    AddCategoryDialogComponent,
    EditCategoryDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    ModifyStateComponent,
    AddOpcionDialogComponent,
    EditOpcionDialogComponent,
    DeleteOpcionDialogComponent,
    viewDishesComponent,
    viewCategoryDishesComponent,
    HomeComponent,
    LoginComponent,
    PedidosComponent,
    OpcionesComponent,
    CategoriasComponent,
    FirstLoginComponent,
    EditProfileComponent,
    ManageOpcionesDialogComponent
  ],
  imports: [
    AngularDualListBoxModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
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
      apiKey: 'AIzaSyB-rXXfM8eiiWGeC4ZpBpNslVqsea6i1Cw'
    })
  ],
  entryComponents: [
    AddDialogComponent,
    AddCategoryDialogComponent,
    EditCategoryDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    ModifyStateComponent,
    viewDishesComponent,
    AddOpcionDialogComponent,
    EditOpcionDialogComponent,
    DeleteOpcionDialogComponent,
    viewCategoryDishesComponent,
    ManageOpcionesDialogComponent
  ],
  providers: [
    PlatosService,
    CategoriaService,
    PedidosPlatosService,
    OpcionesService,
    PedidosService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
