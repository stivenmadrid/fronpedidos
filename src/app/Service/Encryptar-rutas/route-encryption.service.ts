import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256'; // Importa la función de hash SHA-256

@Injectable({
  providedIn: 'root'
})
export class RouteEncryptionService {
  private static routeMap: Map<string, string> = new Map();

  constructor() {
    // Mapa para almacenar las rutas encriptadas
    // Aquí podrías almacenarlas en una base de datos o cualquier otra ubicación segura
    this.encryptRoutes([
      'ui-component/Gestion-humana-doblamos/Parametrizacion-gestion-humana/parametrizacion',
      'ui-component/Solicitud-requisicion-personal',
      'ui-component/Gestion-humana-doblamos',
      'ui-component/Gestion-humana-doblamos/Parametrizacion-gestion-humana/centro-costos-doblamos'
    ]);
  }

  // Método para encriptar las rutas y almacenarlas en el mapa
  private encryptRoutes(routes: string[]): void {
    routes.forEach(route => {
      const encryptedRoute = this.encrypt(route); // Encripta la ruta
      RouteEncryptionService.routeMap.set(route, encryptedRoute); // Almacena la ruta encriptada en el mapa
    });
  }

  // Método para obtener la ruta encriptada
  static getEncryptedRoute(route: string): string {
    return RouteEncryptionService.routeMap.get(route) || route; // Devuelve la ruta encriptada si está disponible, de lo contrario, devuelve la ruta original
  }

  // Función para encriptar una cadena utilizando hash SHA-256
  private encrypt(input: string): string {
    return sha256(input);
  }
}
