import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LineaCeroServiceService {

  private apiUrl = `${environment.apiUrl}/Get-datos-horno-cero`;
  private dataUpdatedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  // Método para obtener los datos de Línea Cero
  getLineaCeroData(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Observable para suscribirse a los cambios de datos
  get dataUpdated$() {
    return this.dataUpdatedSubject.asObservable();
  }

  // Método para notificar que los datos fueron actualizados
  notifyDataUpdated() {
    this.dataUpdatedSubject.next();
  }
}
