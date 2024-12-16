import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RolesService } from 'src/app/Service/Usuarios/roles.service';
import { RegistrarrolesComponent } from './registrarroles/registrarroles.component';
import { EditarrolesComponent } from './editarroles/editarroles.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'guard_name', 'created_at', 'updated_at', 'actions'];
  columnAliases: { [key: string]: string } = {
    'id': 'ID',
    'name': 'Nombre',
    'guard_name': 'Guardia',
    'created_at': 'Fecha de Creación',
    'updated_at': 'Fecha de Actualización',
    'actions': 'Acciones'
  };
  dataSource = new MatTableDataSource<any>();
  roles: any[] = [];
  eliminando: boolean = false; // Propiedad para controlar la visibilidad del spinner

  constructor(
    private rolesService: RolesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.eliminando = true;
    this.rolesService.obtenerRoles().subscribe(
      (roles: any[]) => {
        this.roles = roles;
        this.dataSource.data = roles;
        this.eliminando = false;
      },
      error => {
        this.eliminando = false;
        console.error('Error al obtener roles:', error);
      }
    );
  }

  openRegistrarRolesModal() {
    const dialogRef = this.dialog.open(RegistrarrolesComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se ha cerrado');
      this.obtenerRoles();
    });
  }

  openEditarRolesModal(id: number) {
    const role = this.roles.find(role => role.id === id);
    const dialogRef = this.dialog.open(EditarrolesComponent, {
      width: '400px',
      data: { role, permissions: role.permissions } // Pasa el rol y sus permisos como datos al abrir el modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de edición se ha cerrado');
      this.obtenerRoles();
    });
  }

  eliminarRol(id: number) {
    // Mostrar cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar este rol.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar el spinner mientras se elimina el rol
        this.eliminando = true;
        // Si el usuario confirma la eliminación, llamar al servicio para eliminar el rol
        this.rolesService.eliminarRol(id).subscribe(
          (response) => {
            // Ocultar el spinner después de eliminar el rol
            this.eliminando = false;
            // Verificar si el mensaje contiene información sobre el uso del rol
            if (response && response.message) {
              // Mostrar una alerta informativa sobre el uso del rol
              Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: response.message,
                showCancelButton: true,
                confirmButtonColor: '#3f51b5',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo'
              }).then((confirmResult) => {
                if (confirmResult.isConfirmed) {
                  // Eliminar el rol después de la confirmación
                  this.rolesService.eliminarRolDefinitivo(id).subscribe(
                    () => {
                      // Si la eliminación fue exitosa, mostrar una alerta de éxito
                      Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Rol eliminado exitosamente'
                      });
                      // Volver a cargar la lista de roles después de eliminar el rol
                      this.obtenerRoles();
                    },
                    (error) => {
                      // Mostrar una alerta de error en caso de error al eliminar el rol
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar el rol'
                      });
                    }
                  );
                }
              });
            } else if (response && response.success) {
              // Si la eliminación fue exitosa, mostrar una alerta de éxito
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Rol eliminado exitosamente'
              });
              // Volver a cargar la lista de roles después de eliminar el rol
              this.obtenerRoles();
            } else {
              // Mostrar una alerta de error genérica si la respuesta no contiene información adecuada
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar el rol'
              });
            }
          },
          (error) => {
            // Ocultar el spinner en caso de error
            this.eliminando = false;
            // Mostrar una alerta de error en caso de error al comunicarse con el servidor
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al eliminar el rol'
            });
          }
        );
      }
    });
  }
}
