import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { LoginComponent } from './demo/authentication/login/login.component';
import { AuthGuard } from './Service/auth.guard';
import { PedidosComponent } from './demo/component/Meseros/pedidos/pedidos.component';
import { PedidosliberadosComponent } from './demo/component/Meseros/pedidosliberados/pedidosliberados.component';
import { PedidosCocinaComponent } from './demo/component/Cocina/pedidos-cocina/pedidos-cocina.component';
import { ProductosComponent } from './demo/component/Inventario/productos/productos.component';
import { UsuariosComponent } from './demo/component/Seguridad/usuarios/usuarios.component';
import { SeguridadComponent } from './demo/component/Seguridad/seguridad/seguridad.component';

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
        // data: {
        //   roles: ['mesero', 'Administrador'], // Roles permitidos para acceder a esta ruta
        //   permissions: ['pedidos'] // Permisos permitidos para acceder a esta ruta
        // }
      },

      {
        path: 'Pedidos-liberados',
        component: PedidosliberadosComponent,
        canActivate: [AuthGuard], // Proteger esta ruta con AuthGuard
        // data: {
        //   roles: ['mesero', 'Administrador'],
        //   permissions: ['pedidos liberados']
        // } // Roles permitidos para acceder a esta ruta
      },
      {
        path: 'Pedidos-cocina',
        component: PedidosCocinaComponent,
        canActivate: [AuthGuard], // Proteger esta ruta con AuthGuard
        // data: { roles: ['cocina', 'Administrador'], permissions: ['pedidos cocina'] } // Roles permitidos para acceder a esta ruta
      },
      {
        path: 'Inventarios',
        component: ProductosComponent
      },
      {
        path: 'Usuarios',
        component: UsuariosComponent
      },
      {
        path: 'Seguridad',
        component: SeguridadComponent,
        // canActivate: [AuthGuard],
        // data: { roles: ['Administrador'], permissions: ['seguridad'] }
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
