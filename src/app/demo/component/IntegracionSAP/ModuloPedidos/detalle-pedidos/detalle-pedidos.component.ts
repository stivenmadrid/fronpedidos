import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditarDetallesComponent } from '../editar-detalles/editar-detalles.component';
import { OrdenesVentaService } from 'src/app/Service/IntegracionSAP/ordenes-venta.service'; 
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-detalle-pedidos',
  templateUrl: './detalle-pedidos.component.html',
  styleUrls: ['./detalle-pedidos.component.scss']
})
export class DetallePedidosComponent {
  isUpdateButtonEnabled = false;
  cargarOrdenesVenta = false;
  dataSource: MatTableDataSource<any>;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordenesVentaService: OrdenesVentaService
  ) {
    console.log('Datos recibidos:', data);
  }

  private getUserId(): string {
    return localStorage.getItem('userId');
  }

  updateField(fieldName: string, value: any) {
    this.isUpdateButtonEnabled = true;

    if (fieldName === 'UsuarioGeneroPedido' || fieldName === 'UsuarioModificoPedido') {
      value = this.getUserId();
    }

    this.data.ordenVenta[fieldName] = value;
  }

  updateOrder() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar el pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargarOrdenesVenta = true;  // Activa el spinner
        console.log('Orden de venta antes de enviar:', this.data.ordenVenta);
        console.log('Detalles antes de enviar:', this.data.ordenVenta.detalles);

        const userId = this.getUserId();

        const dataToSend = {
          ...this.data.ordenVenta,
          UsuarioGeneroPedido: userId,
          UsuarioModificoPedido: userId,
          detalles: this.data.ordenVenta.detalles.map((detail) => ({
            ...detail,
            ListaP: detail.ListaP || ''
          }))
        };

        console.log('Datos enviados al backend:', JSON.stringify(dataToSend, null, 2));

        this.ordenesVentaService.updateDetalleOrdenVenta(this.data.ordenVenta.Id_pedido_Caja, dataToSend).subscribe(
          (response) => {
            console.log('Detalle actualizado:', response);
            Swal.fire('Éxito', 'El pedido se actualizó correctamente.', 'success');
            this.isUpdateButtonEnabled = false;
            this.cargarOrdenesVenta = false;  // Desactiva el spinner
          },
          (error) => {
            console.error('Error al actualizar el pedido:', error);
            let errorMessage = 'No se pudo actualizar el pedido. Inténtalo de nuevo.';

            // Manejo de errores específicos del backend
            if (error.status === 422) {
              // Error de validación (Unprocessable Entity)
              errorMessage = this.formatValidationErrors(error.error.messages);
            } else if (error.status === 500) {
              // Error interno del servidor
              errorMessage = 'Error interno del servidor. Por favor, contacta al soporte técnico.';
            } else if (error.status === 404) {
              // No encontrado
              errorMessage = 'Orden de venta no encontrada.';
            } else if (error.error) {
              // Otros errores
              if (typeof error.error === 'object' && error.error.error) {
                errorMessage = error.error.error;
              } else if (typeof error.error === 'string') {
                errorMessage = error.error;
              }
            }

            Swal.fire('Error', errorMessage, 'error');
            this.isUpdateButtonEnabled = false;
            this.cargarOrdenesVenta = false;  // Desactiva el spinner
          }
        );
      }
    });
  }

  updateDetailField(fieldName: string, detail: any) {
    this.isUpdateButtonEnabled = true;

    this.data.ordenVenta.detalles = this.data.ordenVenta.detalles.map((d) =>
      d.id === detail.id ? { ...d, [fieldName]: detail[fieldName] } : d
    );

    this.dataSource = new MatTableDataSource(this.data.ordenVenta.detalles);
    console.log('Detalles actualizados localmente:', this.data.ordenVenta.detalles);
  }



  editDetail(detail: any) {
    const dialogRef = this.dialog.open(EditarDetallesComponent, {
      width: 'auto',
      data: detail
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateDetail(result);
      }
    });
  }


  
  updateDetail(updatedDetail: any) {
    this.isUpdateButtonEnabled = true;
    if (updatedDetail.id_detalle_pedido) {
      this.cargarOrdenesVenta = true; 
      this.updateOrderDetail(updatedDetail);
    } else {
      Swal.fire('Error', 'Falta el ID del detalle para actualizar.', 'error');
    }
  }

  deleteDetail(detail: any) {
    console.log('Eliminar detalle:', detail);
  }

  private updateOrderDetail(detail: any) {
    const id = detail.id_detalle_pedido || this.data.ordenVenta.Id_pedido_Caja;

    if (id) {
      const userId = this.getUserId();
      detail.Producto = 'CHm'; 
      const updatedDetail = { ...detail, UsuarioGeneroPedido: userId, UsuarioModificoPedido: userId };

      console.log('Datos enviados al backend desde updateOrderDetail:', updatedDetail);

      this.ordenesVentaService.updateDetalleOrdenVenta(id, updatedDetail).subscribe(
        (response) => {
          console.log('Detalle actualizado:', response);
          Swal.fire('Éxito', response.message || 'El detalle se actualizó correctamente.', 'success');
          this.isUpdateButtonEnabled = false;
          this.cargarOrdenesVenta = false; 
        },
        (error) => {
          console.error('Error al actualizar el detalle:', error);
          let errorMessage = 'No se pudo actualizar el detalle. Inténtalo de nuevo.';

          // Manejo de errores específicos del backend
          if (error.status === 422) {
            // Error de validación (Unprocessable Entity)
            errorMessage = this.formatValidationErrors(error.error.messages);
          } else if (error.status === 500) {
            // Error interno del servidor
            errorMessage = 'Error interno del servidor. Por favor, contacta al soporte técnico.';
          } else if (error.status === 404) {
            // No encontrado
            errorMessage = 'Detalle de orden de venta no encontrado.';
          } else if (error.error) {
            // Otros errores
            if (typeof error.error === 'object' && error.error.error) {
              errorMessage = error.error.error;
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
          }

          Swal.fire('Error', errorMessage, 'error');
          this.isUpdateButtonEnabled = false;
          this.cargarOrdenesVenta = false; 
        }
      );
    } else {
      Swal.fire('Error', 'No se puede encontrar el ID del detalle para la actualización.', 'error');
      this.cargarOrdenesVenta = false; 
    }
  }

  private formatValidationErrors(errors: any): string {
    let errorMessage = 'Errores de validación:\n';
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errorMessage += `${errors[key].join('\n')}\n`;
      }
    }
    return errorMessage;
  }
}
