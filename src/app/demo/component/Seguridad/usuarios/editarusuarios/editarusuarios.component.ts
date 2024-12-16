import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from '../../../../../Service/Usuarios/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editarusuarios',
  templateUrl: './editarusuarios.component.html',
  styleUrls: ['./editarusuarios.component.scss']
})
export class EditarusuariosComponent implements OnInit {
  user: any = {};
  updatingUser: boolean = false;
  roles: any[] = [];
  selectedRole: string; // Variable para almacenar el rol seleccionado por el usuario
  @Output() usuarioActualizado: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<EditarusuariosComponent>,
    private usuariosService: UsuariosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.user) {
      this.user = { ...data.user };
      this.roles = data.roles;

      // Convertir Notificaciones de "0" o "1" a booleano
      this.user.Notificaciones = this.user.Notificaciones === '1';
      
      // Establecer el rol predeterminado en el arreglo de roles
      const selectedRole = this.roles.find((role) => role.name === this.user.role);
      if (selectedRole) {
        this.selectedRole = selectedRole.name; // Inicializar el rol seleccionado con el rol actual del usuario
      }
    }
  }

  ngOnInit(): void {
    // Verificar si el rol actual del usuario existe en el arreglo de roles
    const selectedRole = this.roles.find((role) => role.name === this.user.role);
    if (selectedRole) {
      this.selectedRole = selectedRole.name;
    } else {
      if (this.roles.length > 0) {
        this.selectedRole = this.roles[0].name;
      }
    }
  }

  updateUser() {
    this.updatingUser = true;

    // Validar los datos manualmente
    const errors = [];
    if (!this.user.name || this.user.name.trim() === '') {
      errors.push('El nombre es obligatorio.');
    }
    if (!this.user.email || !this.validateEmail(this.user.email)) {
      errors.push('El correo electrónico es obligatorio y debe ser válido.');
    }
    if (!this.selectedRole) {
      errors.push('El rol es obligatorio.');
    }

    if (errors.length > 0) {
      // Si hay errores, mostrar mensaje de error
      const validationErrors = errors.join('<br>');
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        html: validationErrors
      });
      this.updatingUser = false; // Restaurar el estado de actualización del usuario
      return;
    }

    // Actualizar el rol del usuario con el rol seleccionado por el usuario
    this.user.role = this.selectedRole;

    // Convertir el valor booleano de Notificaciones a "1" o "0"
    this.user.Notificaciones = this.user.Notificaciones ? '1' : '0';

    // Llamar al servicio para actualizar el usuario
    this.usuariosService.actualizarUsuario(this.user).subscribe(
      (response: any) => {
        // Manejar respuesta exitosa
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: response.message
        });
        this.dialogRef.close();
        this.usuarioActualizado.emit();
        this.updatingUser = false; // Restaurar el estado de actualización del usuario
      },
      (error) => {
        // Manejar error
        console.error(error);
        let errorMessage = 'Hubo un problema al actualizar el usuario';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
        this.updatingUser = false; // Restaurar el estado de actualización del usuario
      }
    );
  }

  validateEmail(email: string): boolean {
    // Función para validar el formato del correo electrónico
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  onCancel() {
    // Función para cerrar el modal sin realizar ninguna acción
    this.dialogRef.close();
  }
}
