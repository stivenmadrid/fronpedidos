import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolesService } from 'src/app/Service/Usuarios/roles.service';
import { PermissionsService } from 'src/app/Service/Usuarios/permissions.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editarroles',
  templateUrl: './editarroles.component.html',
  styleUrls: ['./editarroles.component.scss']
})
export class EditarrolesComponent implements OnInit {
  role: any = {};
  permissions: any[] = [];
  selectedPermissions: any[] = [];
  registrorol = false; // Bandera para controlar la visibilidad del spinner

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    public dialogRef: MatDialogRef<EditarrolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.role = { ...data.role };
  }

  ngOnInit(): void {
    this.obtenerPermisos();
  }

  obtenerPermisos() {
    this.permissionsService.obtenerPermisos().subscribe(
      (permisos: any[]) => {
        this.permissions = permisos;
        // Marcar los permisos que tiene el rol seleccionado
        this.selectedPermissions = this.role.permissions.map(rolePermission => rolePermission.id);
      },
      error => {
        console.error('Error al obtener permisos:', error);
      }
    );
  } 
  
  
  updateRole() {
    if (!this.role.name || !this.role.permissions || this.role.permissions.length === 0) {
      console.error('Nombre y permisos son campos requeridos.');
      return;
    }

    // Mostrar el spinner
    this.registrorol = true;
  
    // Actualizar los permisos del rol con los nuevos permisos seleccionados
    this.role.permissions = this.selectedPermissions.map(id => ({ id }));
    this.rolesService.actualizarRol(this.role.id, this.role).subscribe(
      (response: any) => { // Función de éxito
        console.log('Rol actualizado:', response); // Acceder a la respuesta del servidor
        Swal.fire({ // Mostrar alerta de éxito
          icon: 'success',
          title: 'Éxito',
          text: 'El rol se ha actualizado correctamente.'
        }).then(() => {
          this.dialogRef.close(); // Cerrar el diálogo modal después de que el usuario confirme la alerta
          // Ocultar el spinner
          this.registrorol = false;
        });
      },
      (error) => { // Función de error
        console.error('Error al actualizar el rol:', error); // Capturar y manejar el error
        Swal.fire({ // Mostrar alerta de error
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar el rol. Por favor, inténtalo de nuevo.'
        }).then(() => {
          // Ocultar el spinner
          this.registrorol = false;
        });
      }
    );
  }
  
  onCancel() {
    this.dialogRef.close();
  }
}
