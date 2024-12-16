import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenesVentaService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ObtenerOrdenesVentaGTS() {
    return this.http.get<any[]>(`${this.apiUrl}/Ordenes-Venta`, { headers: this.getHeaders() });
  }

  ObtenerOrdenesVentaEnviadasSAPGTS() {
    return this.http.get<any[]>(`${this.apiUrl}/Ordenes-Venta-GeneradasSAP`, { headers: this.getHeaders() });
  }
  getModificacionesPedidos() {
    return this.http.get<any[]>(`${this.apiUrl}/LogModificacionesOP`, { headers: this.getHeaders() });
  }

  ObtenerOrdenesVentaGTSEnviadasSAP() {
    return this.http.get<any[]>(`${this.apiUrl}/Ordenes-Venta-GeneradasSAP`, { headers: this.getHeaders() });
  }

  obtenerDetalleOrdenVenta(id: string) {
    return this.http.get<any>(`${this.apiUrl}/Ordenes-Venta/${id}/detalles`, { headers: this.getHeaders() });
  }


  eliminarOrdenVenta(id_pedido_Caja: string): Observable<void> {
    const body = { id_pedido_Caja }; // El parámetro se envía en el cuerpo de la solicitud
  
    return this.http.post<void>(`${this.apiUrl}/eliminar/Ordenes-Venta`, body, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error en el servicio:', error);
          // Aquí puedes usar alguna notificación visual para alertar al usuario
          return throwError(error);
        })
      );
  }
  

  ImportarOrdenVentaGenerarPedidoGTS(encabezados: any[], lineas: any[], userId: string) {
    const body = { encabezados, lineas,userId };
    return this.http.post<any>(`${this.apiUrl}/AlmacenarOrdenVentaImportadaExcel`, body, { headers: this.getHeaders() });
  }

  generarPedidosEnSAP(ids: string[]): Observable<any> {
    const body = { ids };
    return this.http.post<any>(`${this.apiUrl}/Generar-Ordenes-Venta-SAP`, body, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error en el servicio:', error);
          return throwError(error);
        })
      );
  }

  createInternalOrder(orderData: { headers: any, details: any[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-internal-order`, orderData, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error en createInternalOrder:', error);
          return throwError(error);
        })
      );
  }

  updateDetalleOrdenVenta(id: string, detalle: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ActualizarOrdenVenta/${id}`, detalle, { headers: this.getHeaders() })
    .pipe(
      catchError((error) => {
        console.error('Error en el servicio:', error);
        return throwError(error);
      })
    );
    
  }
  

  
}
