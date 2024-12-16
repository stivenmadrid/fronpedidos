import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesSapService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  consultarClienteSAP(cardCode?: string, cardName?: string): Observable<any> {
    let params = new HttpParams();
    if (cardCode) {
      params = params.set('cardCode', cardCode);
    }
    if (cardName) {
      params = params.set('cardName', cardName);
    }

    return this.http.get(`${this.apiUrl}/Importar-Clientes-Sap`, { params });
  }
}
