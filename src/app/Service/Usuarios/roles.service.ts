import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  obtenerRoles() {
    const token = localStorage.getItem('token'); // Obtiene el token de autenticación del almacenamiento local
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Crea los encabezados con el token
    return this.http.get<any[]>(`${this.apiUrl}/roles`, { headers }); // Agrega los encabezados a la solicitud HTTP GET
  }

  createRole(role: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/roles`, role, { headers });
  }
  
  actualizarRol(id: number, rol: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/roles/update/${id}`, rol, { headers });
  }

  eliminarRol(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/roles/destroy/${id}`, { headers });
  }
  
  eliminarRolDefinitivo(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/roles/destroy/${id}`, { headers });
  }
  
  
  
}
