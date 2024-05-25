import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class UsuariosService {
  private apiUrl = environment.apiUrl;
  private usuarioRegistradoSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  obtenerUsuarios() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { headers });
  }

  registerUsuario(userData: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/register`, userData, { headers }).pipe(
      tap(() => {
        this.usuarioRegistradoSubject.next(); // Emitir evento de usuario registrado
      })
    );
  }

  get usuarioRegistrado$() {
    return this.usuarioRegistradoSubject.asObservable();
  }


  resetPassword(userId: string, payload: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/reset-password/${userId}`, payload, { headers });
  }

  actualizarUsuario(usuario: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/usuarios/actualizar/${usuario.id}`, usuario, { headers });
  }
}
