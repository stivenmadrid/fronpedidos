import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.apiUrl;
  private usuarioRegistradoSubject = new Subject<void>();
  usuarioActualizado$: Subject<void> = new Subject<void>(); 

  constructor(private http: HttpClient) {}

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
        this.usuarioRegistradoSubject.next();
      })
    );
  }

  get usuarioRegistrado$() {
    return this.usuarioRegistradoSubject.asObservable();
  }

  resetPassword(userId: string, payload: any) {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Crea los headers con el token
  
    // Realiza la solicitud POST para restablecer la contraseña
    return this.http.post<any>(`${this.apiUrl}/reset-password/${userId}`, payload, { headers });
  }
  

  
  actualizarUsuario(usuario: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post<any>(`${this.apiUrl}/usuarios/actualizar/${usuario.id}`, usuario, { headers });
  }
  


  inactivarUsuario(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post<any>(`${this.apiUrl}/inactivar-usuario/${userId}`, null, { headers })
      .pipe(tap(() => this.usuarioActualizado$.next()));
  }
}
