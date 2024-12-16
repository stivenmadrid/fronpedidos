import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from '../../../../../Service/Usuarios/usuarios.service';
import { RolesService } from '../../../../../Service/Usuarios/roles.service'; // Importa el servicio de roles
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrarusuarios',
  templateUrl: './registrarusuarios.component.html',
  styleUrls: ['./registrarusuarios.component.scss']
})
export class RegistrarusuariosComponent implements OnInit {
  user: any = { Notificaciones: false }; // Initialize with a boolean
  registrousuario: boolean = false; // Variable para controlar el estado del spinner
  roles: any[] = []; // Arreglo para almacenar los roles

  constructor(
    private usuariosService: UsuariosService,
    private rolesService: RolesService, // Inyecta el servicio de roles
    private dialogRef: MatDialogRef<RegistrarusuariosComponent>
  ) { }

  ngOnInit(): void {
    // Cuando se inicializa el componente, se obtienen los roles
    this.obtenerRoles();
  }

  obtenerRoles() {
    // Lógica para obtener los roles utilizando el servicio de roles
    this.rolesService.obtenerRoles().subscribe(
      (roles: any[]) => {
        // Cuando se obtienen los roles con éxito, se asignan al arreglo roles
        this.roles = roles;
      },
      error => {
        console.error('Error al obtener roles:', error);
        // Aquí puedes agregar lógica adicional para manejar el error, como mostrar un mensaje al usuario
      }
    );
  }

  registerUser() {
    // Activa el spinner
    this.registrousuario = true;

    // Lógica para registrar el usuario
    this.usuariosService.registerUsuario(this.user).subscribe(
      (response) => {
        // Muestra una alerta de éxito utilizando SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario registrado exitosamente'
        });
        // Cierra el modal
        this.dialogRef.close();
      },
      (error) => {
        // Muestra una alerta de error utilizando SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message
        });
      }
    ).add(() => {
      // Desactiva el spinner al completar la operación (tanto si tiene éxito como si falla)
      this.registrousuario = false;
    });
  }

  onCancel() {
    // Función para cerrar el modal sin realizar ninguna acción
    this.dialogRef.close();
  }
}
