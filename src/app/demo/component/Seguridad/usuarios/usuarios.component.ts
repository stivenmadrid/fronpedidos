import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosService } from '../../../../Service/Usuarios/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistrarusuariosComponent } from '../usuarios/registrarusuarios/registrarusuarios.component';
import { RestablecercontrasenaComponent } from './restablecercontrasena/restablecercontrasena.component';
import { EditarusuariosComponent } from './editarusuarios/editarusuarios.component';
import { RolesService } from '../../../../Service/Usuarios/roles.service'; 

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'roles', 'actions'];
  columnAliases: { [key: string]: string } = {
    'id': 'ID',
    'name': 'Nombre',
    'email': 'Correo Electrónico',
    'roles': 'Roles',
    'actions': 'Acciones'
  };
  dataSource = new MatTableDataSource<any>();
  usuarios: any[] = [];
  roles: any[] = []; // Define la propiedad roles

  constructor(private usuariosService: UsuariosService, private dialog: MatDialog, private rolesService: RolesService) { }


  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerRoles(); // Llama a la función para obtener los roles

    this.usuariosService.usuarioRegistrado$.subscribe(() => {
      this.obtenerUsuarios();
    });
  }

  obtenerUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe(
      (usuarios: any[]) => {
        this.usuarios = usuarios;
        this.dataSource.data = usuarios;
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerRoles() {
    this.rolesService.obtenerRoles().subscribe(
      (roles: any[]) => {
        this.roles = roles;
      },
      error => {
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
            roles: roles // Pasar los roles al componente de edición
          }
        });
      },
      error => {
        console.error('Error al obtener roles:', error);
      }
    );
  }
  
  

  restablecerContrasena(usuario: any) {
    this.dialog.open(RestablecercontrasenaComponent, {
      data: { userId: usuario.id },
    });
  }
  
}
