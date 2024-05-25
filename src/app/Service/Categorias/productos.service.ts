import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }


  ObtenerProductosCategoria() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/v1/productos/categoria/1`, { headers });
  }



}
