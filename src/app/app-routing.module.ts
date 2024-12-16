import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { LoginComponent } from './demo/authentication/login/login.component';
import { AuthGuard } from './Service/auth.guard';
import { UsuariosComponent } from './demo/component/Seguridad/usuarios/usuarios.component';
import { SeguridadComponent } from './demo/component/Seguridad/seguridad/seguridad.component';
import { PedidosComponent } from './demo/component/IntegracionSAP/ModuloPedidos/pedidos/pedidos.component';
import { InterfazLineaCeroComponent } from './demo/component/LineaCero/interfaz-linea-cero/interfaz-linea-cero.component'; 

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component')
      },
      {
        path: 'Generar-pedidos',
        component: PedidosComponent,
        canActivate: [AuthGuard], // Proteger esta ruta con AuthGuard
        data: {
          roles: ['Manager','Operarios'], // Roles permitidos para acceder a esta ruta
          permissions: ['Modulo_Pedidos'] // Permisos permitidos para acceder a esta ruta
        }
      },

      {
        path: 'Usuarios',
        component: UsuariosComponent
      },
      {
        path: 'LineaCero',
        component: InterfazLineaCeroComponent,
      },

      {
        path: 'Seguridad',
        component: SeguridadComponent,
        canActivate: [AuthGuard], // Proteger esta ruta con AuthGuard
        data: {
          roles: ['Manager'], // Roles permitidos para acceder a esta ruta
          permissions: ['Modulo_Administracion'] // Permisos permitidos para acceder a esta ruta
        }
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
