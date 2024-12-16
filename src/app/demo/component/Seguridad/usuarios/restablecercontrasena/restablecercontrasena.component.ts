import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from '../../../../../Service/Usuarios/usuarios.service'; // Importa el servicio
import Swal from 'sweetalert2'; // Importa la biblioteca SweetAlert2

@Component({
  selector: 'app-restablecercontrasena',
  templateUrl: './restablecercontrasena.component.html',
  styleUrls: ['./restablecercontrasena.component.scss']
})
export class RestablecercontrasenaComponent {
  user: any = {};
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RestablecercontrasenaComponent>,
    private usuariosService: UsuariosService, // Inyecta el servicio
    @Inject(MAT_DIALOG_DATA) public data: any // Inyecta los datos pasados al diálogo
  ) {}

  ngOnInit(): void {
    // Asignar el ID del usuario desde los datos inyectados
    if (this.data && this.data.userId) {
      this.user.id = this.data.userId;
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Cierra el diálogo sin hacer nada
  }

 resetPassword() {
  if (this.isPasswordValid()) {
    // Mostrar confirmación antes de proceder
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Estás seguro que deseas restablecer la contraseña?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restablecer',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true; // Muestra el spinner mientras se procesa
        
        // Asegúrate de enviar `password_confirmation` en lugar de `confirmPassword`
        const payload = {
          password: this.user.password,
          password_confirmation: this.confirmPassword
        };
        
        this.usuariosService.resetPassword(this.user.id, payload).subscribe(
          response => {
            this.loading = false; // Oculta el spinner
            Swal.fire({
              icon: 'success',
              title: 'Contraseña restablecida',
              text: 'La contraseña se ha restablecido correctamente.',
            });
            this.dialogRef.close(); // Cierra el diálogo después del éxito
          },
          error => {
            this.loading = false; // Oculta el spinner
  
            if (error.status === 422) {
              // Extraer y mostrar los mensajes de validación del backend
              const validationErrors = error.error.errors;
              let errorMessage = 'Errores de validación: \n';
              
              // Agregar cada error de validación al mensaje de error
              Object.keys(validationErrors).forEach((key) => {
                validationErrors[key].forEach((msg: string) => {
                  errorMessage += `${msg}\n`;
                });
              });
  
              Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: errorMessage
              });
            } else {
              // Otros errores
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al restablecer la contraseña.'
              });
            }
          }
        );
      }
    });
  }
}

  

  isPasswordValid(): boolean {
    // Validación simple: ambas contraseñas deben coincidir y no estar vacías
    return this.user.password && this.confirmPassword && this.user.password === this.confirmPassword;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Aquí puedes implementar la lógica para procesar el archivo
      console.log('Archivo seleccionado:', file);
      // Por ejemplo, mostrar una alerta con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Archivo seleccionado',
        text: `Nombre: ${file.name}, Tamaño: ${file.size} bytes`,
      });
    }
  }
}
