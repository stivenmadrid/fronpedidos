import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosService } from '../../../../Service/Usuarios/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistrarusuariosComponent } from '../usuarios/registrarusuarios/registrarusuarios.component';
import { RestablecercontrasenaComponent } from './restablecercontrasena/restablecercontrasena.component';
import { EditarusuariosComponent } from './editarusuarios/editarusuarios.component';
import { RolesService } from '../../../../Service/Usuarios/roles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  //columnas para visualizar en la tabla de usuarios
  displayedColumns: string[] = ['id', 'name', 'email', 'roles', 'actions'];

  // Damos un sobre nombre a las columnas de los nombres
  columnAliases: { [key: string]: string } = {
    id: 'ID',
    name: 'Usuario',
    email: 'Correo Electrónico',
    roles: 'Role',
    actions: 'Acciones'
  };

  dataSource = new MatTableDataSource<any>();

  usuarios: any[] = [];
  roles: any[] = [];
  updatingUser: boolean = false;
  constructor(
    private usuariosService: UsuariosService,
    private dialog: MatDialog,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerRoles(); // Llama a la función para obtener los roles

    this.usuariosService.usuarioRegistrado$.subscribe(() => {
      this.obtenerUsuarios();
    });
  }

  
  obtenerUsuarios() {
    this.updatingUser = true;
    this.usuariosService.obtenerUsuarios().subscribe(
      (usuarios: any[]) => {
        this.usuarios = usuarios;
        this.dataSource.data = usuarios;
        this.updatingUser = false; // Detener el spinner cuando la respuesta sea exitosa
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
        this.updatingUser = false; // Detener el spinner cuando ocurra un error
      }
    );
  }

  obtenerRoles() {
    this.rolesService.obtenerRoles().subscribe(
      (roles: any[]) => {
        this.roles = roles;
      },
      (error) => {
        console.error('Error al obtener roles:', error);
      }
    );
  }

  openRegistrarUsuariosModal() {
    this.dialog.open(RegistrarusuariosComponent, {
      width: '500px'
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter() {
    this.dataSource.filter = '';
  }

  editarUsuario(usuario: any) {
    this.rolesService.obtenerRoles().subscribe(
      (roles: any[]) => {
        this.dialog.open(EditarusuariosComponent, {
          data: {
            user: usuario,
            roles: roles
          }
        });
      },
      (error) => {
        console.error('Error al obtener roles:', error);
      }
    );
  }

  restablecerContrasena(usuario: any) {
    this.dialog.open(RestablecercontrasenaComponent, {
      data: { userId: usuario.id }
    });
  }

  inactivarUsuario(usuario: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas inactivar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, inactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updatingUser = true; // Muestra el spinner mientras se procesa la solicitud
        this.usuariosService.inactivarUsuario(usuario.id).subscribe(
          (response: any) => {
            this.updatingUser = false;
            this.obtenerUsuarios(); // Refresca la lista de usuarios
            Swal.fire({
              icon: 'success',
              title: 'Usuario inactivado',
              text: response.message
            });
          },
          (error: any) => {
            console.error('Error al inactivar usuario:', error);
            this.updatingUser = false;
            let errorMessage = '';
            if (error.error.errors) {
              Object.values(error.error.errors).forEach((errorMessages: string[]) => {
                errorMessages.forEach((message: string) => {
                  errorMessage += `${message}\n`;
                });
              });
            } else {
              errorMessage = error.error.message || 'Error desconocido';
            }
            Swal.fire({
              icon: 'error',
              title: 'Error al inactivar usuario',
              text: errorMessage
            });
          }
        );
      }
    });
  }
}
