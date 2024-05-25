import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private userRoles: string[] = [];
  private userPermissions: string[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response: any) => {
          const { token, name, roles, permissions } = response;
          localStorage.setItem('token', token);
          localStorage.setItem('name', name);
          localStorage.setItem('roles', JSON.stringify(roles));
          localStorage.setItem('permissions', JSON.stringify(permissions));
          this.userRoles = roles;
          this.userPermissions = permissions;
          console.log('Autenticación exitosa:', response);
          this.router.navigate(['/dashboard/default']);
        }),
        catchError(error => {
          console.error('Error en la autenticación:', error);
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('roles');
        localStorage.removeItem('permissions');
        console.log('Sesión cerrada exitosamente');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Error al cerrar sesión:', error);
        throw error;
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const roles = localStorage.getItem('roles');
    const permissions = localStorage.getItem('permissions');
    return !!token && !!roles && !!permissions;
  }

  private loadUserFromLocalStorage(): void {
    if (this.isAuthenticated()) {
      this.userRoles = JSON.parse(localStorage.getItem('roles'));
      this.userPermissions = JSON.parse(localStorage.getItem('permissions'));
    }
  }

  getNombreEmpleado(): string {
    return localStorage.getItem('name');
  }

  getUserRoles(): string[] {
    return this.userRoles;
  }

  getUserPermissions(): string[] {
    return this.userPermissions;
  }
}
