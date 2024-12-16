// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { NavigationComponent } from './theme/layouts/admin/navigation/navigation.component';
import { NavBarComponent } from './theme/layouts/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layouts/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layouts/admin/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './theme/layouts/admin/navigation/nav-content/nav-content.component';
import { NavCollapseComponent } from './theme/layouts/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layouts/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layouts/admin/navigation/nav-content/nav-item/nav-item.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { CommonModule, DatePipe } from '@angular/common'; 
//importaciones de aplicaciones
import { LoginComponent } from './demo/authentication/login/login.component';
import { UsuariosComponent } from './demo/component/Seguridad/usuarios/usuarios.component';
import { RolesComponent } from './demo/component/Seguridad/roles/roles.component';
import { SeguridadComponent } from './demo/component/Seguridad/seguridad/seguridad.component';
import { RegistrarusuariosComponent } from './demo/component/Seguridad/usuarios/registrarusuarios/registrarusuarios.component';
import { PermisosComponent } from './demo/component/Seguridad/permisos/permisos.component';
import { RegistrarrolesComponent } from './demo/component/Seguridad/roles/registrarroles/registrarroles.component';
import { RegistrarpermisosComponent } from './demo/component/Seguridad/permisos/registrarpermisos/registrarpermisos.component';
import { RestablecercontrasenaComponent } from './demo/component/Seguridad/usuarios/restablecercontrasena/restablecercontrasena.component';
import { EditarusuariosComponent } from './demo/component/Seguridad/usuarios/editarusuarios/editarusuarios.component';
import { EditarrolesComponent } from './demo/component/Seguridad/roles/editarroles/editarroles.component';
import { EditarpermisosComponent } from './demo/component/Seguridad/permisos/editarpermisos/editarpermisos.component';
import { PedidosComponent } from './demo/component/IntegracionSAP/ModuloPedidos/pedidos/pedidos.component';
import { ListaPedidosPendientesSAPComponent } from './demo/component/IntegracionSAP/ModuloPedidos/lista-pedidos-pendientes-sap/lista-pedidos-pendientes-sap.component';
import { ImportarPedidosComponent } from './demo/component/IntegracionSAP/ModuloPedidos/importar-pedidos/importar-pedidos.component';
import { DetallePedidosComponent } from './demo/component/IntegracionSAP/ModuloPedidos/detalle-pedidos/detalle-pedidos.component';
import { EditarDetallesComponent } from './demo/component/IntegracionSAP/ModuloPedidos/editar-detalles/editar-detalles.component';
import { PedidosEnviadosSAPComponent } from './demo/component/IntegracionSAP/ModuloPedidos/pedidos-enviados-sap/pedidos-enviados-sap.component';
import { PedidosManualesComponent } from './demo/component/IntegracionSAP/ModuloPedidos/pedidos-manuales/pedidos-manuales.component';
import { LogModificacionesPedidosComponent } from './demo/component/IntegracionSAP/ModuloPedidos/log-modificaciones-pedidos/log-modificaciones-pedidos.component';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { InterfazLineaCeroComponent } from './demo/component/LineaCero/interfaz-linea-cero/interfaz-linea-cero.component';


//importaciones de angular material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    GuestComponent,
    NavigationComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    LoginComponent,
    UsuariosComponent,
    RolesComponent ,
    SeguridadComponent,
    RegistrarusuariosComponent,
    PermisosComponent,
    RegistrarrolesComponent,
    RegistrarpermisosComponent,
    RestablecercontrasenaComponent,
    EditarusuariosComponent,
    EditarrolesComponent,
    EditarpermisosComponent,
    PedidosComponent,
    ListaPedidosPendientesSAPComponent,
    ImportarPedidosComponent,
    DetallePedidosComponent,
    InterfazLineaCeroComponent,
    EditarDetallesComponent,
    PedidosEnviadosSAPComponent,
    PedidosManualesComponent,
    LogModificacionesPedidosComponent
   
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatExpansionModule,
    FormsModule
    
    
  ],
  bootstrap: [AppComponent],
  providers: [provideAnimationsAsync(), DatePipe],
})
export class AppModule {}
