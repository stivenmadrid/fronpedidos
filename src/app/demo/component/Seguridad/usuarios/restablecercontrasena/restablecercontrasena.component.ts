import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from '../../../../../Service/Usuarios/usuarios.service';
import Swal from 'sweetalert2'; // Importa la biblioteca SweetAlert2

@Component({
  selector: 'app-restablecercontrasena',
  templateUrl: './restablecercontrasena.component.html',
  styleUrls: ['./restablecercontrasena.component.scss']
})
export class RestablecercontrasenaComponent {
  user: any = {};
  confirmPassword: string = '';
  isLoading: boolean = false;
  validationErrorMessage: string = ''; // Variable para almacenar el mensaje de error de validación

  constructor(
    public dialogRef: MatDialogRef<RestablecercontrasenaComponent>,
    private usuariosService: UsuariosService,
    @Inject(MAT_DIALOG_DATA) public data: any // Injecta los datos del diálogo
  ) {
    if (data && data.userId) {
      this.user.id = data.userId; // Obtiene el ID del usuario desde los datos del diálogo
    }
  }

  resetPassword() {
    if (this.isPasswordValid()) {
      const payload = {
        password: this.user.password,
        password_confirmation: this.confirmPassword
      };

      this.isLoading = true;

      // Llama al método del servicio para restablecer la contraseña, pasando el ID del usuario
      this.usuariosService.resetPassword(this.user.id, payload).subscribe(
        (response: any) => {
          console.log(response);
          // Restablecimiento de contraseña exitoso
          Swal.fire('Éxito', response.message, 'success'); // Muestra una alerta de éxito
          this.isLoading = false;
          this.dialogRef.close();
        },
        (error) => {
          console.error(error);
          // Manejo de errores
          if (error.error && error.error.errors && error.error.errors.password) {
            this.validationErrorMessage = error.error.errors.password[0]; // Captura el mensaje de error de validación
          } else {
            this.validationErrorMessage = 'Error al restablecer la contraseña'; // Mensaje de error predeterminado
          }
          Swal.fire('Error', this.validationErrorMessage, 'error'); // Muestra una alerta de error
          this.isLoading = false;
        }
      );
    }
  }

  isPasswordValid(): boolean {
    return this.user.password && this.confirmPassword && this.user.password === this.confirmPassword;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
