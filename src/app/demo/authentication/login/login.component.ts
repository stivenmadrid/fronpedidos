// LoginComponent TypeScript

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authenticationMessage: string = '';
  authenticating: boolean = false;
  errorMessage: string = ''; // Variable para almacenar el mensaje de error del servidor

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authenticating = true; // Establece authenticating en true cuando se hace clic en el botón

      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe(
        (response) => {
          this.authenticationMessage = 'Autenticación exitosa';
          console.log('Autenticación exitosa:', response);
          this.authenticating = false;
        },
        (error) => {
          console.log('Error en el inicio de sesión:', error);
          this.authenticating = false;

          if (error.status === 401) {
            this.errorMessage = 'Credenciales inválidas, verifica e intenta nuevamente';
          } else {
            this.errorMessage = 'Error en la autenticación. Por favor, inténtalo de nuevo.';
          }

          // Restablecer la visibilidad de la alerta
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000); // Después de 5 segundos
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
