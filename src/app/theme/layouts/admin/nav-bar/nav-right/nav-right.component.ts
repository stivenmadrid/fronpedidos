import { Component } from '@angular/core';
import { AuthService } from '../../../../../Service/auth.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {

  name: string; // Propiedad para almacenar el nombre del empleado
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.name = this.authService.getNombreEmpleado();
  }
  profile = [
    {
      icon: 'ti ti-edit-circle',
      title: 'Edit Profile'
    },
    {
      icon: 'ti ti-user',
      title: 'View Profile'
    },
    {
      icon: 'ti ti-clipboard',
      title: 'Social Profile'
    },
    {
      icon: 'ti ti-edit-circle',
      title: 'Billing'
    },
    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'History'
    }
  ];

  // Método para manejar el logout
  logout() {
    this.authService.logout().subscribe(
      () => {
        console.log('Sesión cerrada exitosamente');
        // Puedes redirigir a otra página después del logout si es necesario
      },
      error => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }
}
