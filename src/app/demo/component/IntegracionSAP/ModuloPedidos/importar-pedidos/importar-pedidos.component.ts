import { Component, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { OrdenesVentaService } from 'src/app/Service/IntegracionSAP/ordenes-venta.service';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-importar-pedidos',
  templateUrl: './importar-pedidos.component.html',
  styleUrls: ['./importar-pedidos.component.scss']
})
export class ImportarPedidosComponent {
  @Output() importCompleted = new EventEmitter<void>();
  encabezadosData: any[] = [];
  lineasData: any[] = [];
  fileLoaded: boolean = false;
  generarpedidosgts: boolean = false;

  constructor(
    private ordenesVentaService: OrdenesVentaService,
    private authService: AuthService
  ) {}

  onFileChange(event: any) {
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      this.fileLoaded = true;
      this.generarpedidosgts = true;
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        // Leer la hoja de encabezados
        const encabezadosSheetName: string = workbook.SheetNames.find((name) => name.toLowerCase().includes('encabezados'));
        const encabezadosSheet: XLSX.WorkSheet = workbook.Sheets[encabezadosSheetName];
        this.encabezadosData = XLSX.utils.sheet_to_json(encabezadosSheet, { header: 1 });

        // Convertir fechas en la hoja de encabezados
        this.encabezadosData = this.encabezadosData.map((row, index) => {
          if (index === 0) return row; // Saltar la fila de encabezados
          row[1] = this.formatDate(row[1]); // Convertir la fecha en la segunda columna
          row[14] = this.formatDate(row[14]); // Convertir Fecha_Factura
          row[15] = this.formatDate(row[15]); // Convertir Fecha_Despacho
          row[16] = this.formatDate(row[16]); // Convertir U_FecEstimadaEntProduccion
          return row;
        });

        // Imprimir los datos procesados de encabezados
        console.log('Encabezados procesados:', this.processEncabezados(this.encabezadosData));

        // Leer la hoja de líneas
        const lineasSheetName: string = workbook.SheetNames.find((name) => name.toLowerCase().includes('lineas'));
        const lineasSheet: XLSX.WorkSheet = workbook.Sheets[lineasSheetName];
        this.lineasData = XLSX.utils.sheet_to_json(lineasSheet, { header: 1 });

        // Imprimir los datos procesados de líneas
        console.log('Líneas procesadas:', this.processLineas(this.lineasData));

        this.generarpedidosgts= false; // Desactivar el spinner de carga
      };

      reader.readAsBinaryString(archivoSeleccionado);
    }
  }

  grabarOrdenVenta() {
    // Mostrar SweetAlert para confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas generar el pedido en GTS?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar pedido',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.generarpedidosgts = true;
        // Procesar datos para enviar al backend
        const encabezados = this.processEncabezados(this.encabezadosData);
        const lineas = this.processLineas(this.lineasData);

        // Obtener el UserId desde el AuthService
        const userId = this.authService.getUserId();

        // Imprimir los datos que se enviarán al backend
        console.log('Datos a enviar al backend (Encabezados):', encabezados);
        console.log('Datos a enviar al backend (Líneas):', lineas);

        // Usar el servicio para enviar los datos al backend
        this.ordenesVentaService.ImportarOrdenVentaGenerarPedidoGTS(encabezados, lineas, userId).subscribe(
          (response) => {
            Swal.fire('¡Pedido generado!', 'El pedido se ha generado correctamente.', 'success');
            this.importCompleted.emit(); // Emitir el evento cuando la importación esté completa
            this.generarpedidosgts = false;
          },
          (error) => {
            // Procesar y mostrar el error recibido
            console.error('Error al generar el pedido:', error);
            this.generarpedidosgts = false;

            if (error.error && error.error.error) {
              const errorMessage = error.error.error;

              // Verificar si el mensaje contiene los Id_pedido_Caja duplicados
              if (errorMessage.startsWith('Los siguientes pedidos con Id_pedido_Caja ya existen:')) {
                // Extraer los Id_pedido_Caja duplicados del mensaje
                const idsDuplicados = errorMessage.replace('Los siguientes pedidos con Id_pedido_Caja ya existen: ', '').split(', ');
                Swal.fire('Error', `Los siguientes pedidos con Id_pedido_Caja ya existen: ${idsDuplicados.join(', ')}`, 'error');
              } else if (errorMessage.startsWith('Los siguientes Id_pedido_Caja no tienen encabezado correspondiente:')) {
                // Extraer los Id_pedido_Caja sin encabezado correspondiente del mensaje
                const idsSinEncabezado = errorMessage
                  .replace('Los siguientes Id_pedido_Caja no tienen encabezado correspondiente: ', '')
                  .split(', ');
                Swal.fire(
                  'Error',
                  `Los siguientes Id_pedido_Caja no tienen encabezado correspondiente: ${idsSinEncabezado.join(', ')}`,
                  'error'
                );
              } else {
                Swal.fire('Error', errorMessage, 'error');
              }
            } else if (error.status === 0) {
              Swal.fire(
                'Error del Servidor',
                'No se pudo conectar con el servidor. Por favor, asegúrate de que el servidor está en funcionamiento.',
                'error'
              );
            } else if (error.status === 500) {
              Swal.fire(
                'Error del Servidor',
                'Ha ocurrido un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.',
                'error'
              );
            } else {
              Swal.fire('Error', 'Ha ocurrido un error desconocido. Por favor, inténtelo de nuevo.', 'error');
            }
          }
        );
      }
    });
  }

  private processEncabezados(data: any[]): any[] {
    return data
      .slice(1) // Omite la fila de encabezados
      .map((row) => ({
        Id_pedido_Caja: row[0],
        Fecha_Pedido: row[1], // Convertir la fecha en la segunda columna
        Numero_Pedido: row[2],
        Almacen: row[3],
        Lista_P: row[4],
        Cantidad: row[5],
        Precio_Total: row[6],
        UsuarioSAP: row[7],
        CodCliente: row[8],
        Cadena: row[9],
        Nombre_Almacen: row[10],
        Comentario_Inicial: row[11],
        Comentario_Final: row[12],
        Tipo_Pedido: row[13],
        Fecha_Factura: this.formatDate(row[14]), // Convertir Fecha_Factura
        Fecha_Despacho: this.formatDate(row[15]), // Convertir Fecha_Despacho
        U_FecEstimadaEntProduccion: this.formatDate(row[16]), // Convertir U_FecEstimadaEntProduccion
        Cajas: row[17],
        Paquetes: row[18]

      }))
      .filter((item) => item.Fecha_Pedido && item.Numero_Pedido); // Filtrar filas con campos vacíos
  }

  private processLineas(data: any[]): any[] {
    return data
      .slice(1)
      .map((row) => ({
        Id_detalle_Pedido: row[0] || null, // Usa null si está indefinido
        Id_pedido_Caja: row[1] || null, // Usa null si está indefinido
        Almacen: row[2] || null,
        Lista_P: row[3] || null,
        Producto: row[4] || null,
        Cantidad: row[5] || null,
        Precio_Total: row[6] || null,
        Observacion: row[7] || null,
        CodArticulo: row[8] || null,
        NombreArticulo: row[9] || null,
        Cajas: row[10] || null,       // Añadir la columna Cajas
        Paquetes: row[11] || null     // Añadir la columna Paquetes
      }))
      .filter((item) => item.Id_detalle_Pedido && item.Id_pedido_Caja); // Filtra filas con campos vacíos
  }

  private formatDate(date: any): string {
    // Verificar si la fecha es un número (número de serie de Excel)
    if (typeof date === 'number') {
      const dateObj = new Date(Math.round((date - 25569) * 86400 * 1000));
      return dateObj.toISOString().split('T')[0]; // Devolver en formato 'YYYY-MM-DD'
    }
    return date; // Devuelve la fecha como está si no es un número
  }
}
