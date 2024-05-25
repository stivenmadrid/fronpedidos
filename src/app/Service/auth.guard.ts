import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el elemento de navegación requiere roles
    const requiredRoles = (route.data['roles'] as string[]) || [];
    if (requiredRoles.length > 0) {
      const userRoles = this.authService.getUserRoles();
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      if (!hasRequiredRole) {
        this.router.navigate(['/access-denied']);
        return false;
      }
    }

    // Verificar si el elemento de navegación requiere permisos
    const requiredPermissions = (route.data['permissions'] as string[]) || [];
    if (requiredPermissions.length > 0) {
      const userPermissions = this.authService.getUserPermissions();
      const hasRequiredPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
      if (!hasRequiredPermission) {
        this.router.navigate(['/access-denied']);
        return false;
      }
    }

    return true;
  }
}
