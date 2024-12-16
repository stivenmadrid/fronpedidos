import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { OrdenesVentaService } from 'src/app/Service/IntegracionSAP/ordenes-venta.service';
import { DetallePedidosComponent } from '../detalle-pedidos/detalle-pedidos.component';
import { ImportarPedidosComponent } from '../importar-pedidos/importar-pedidos.component';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { PedidosManualesComponent } from '../pedidos-manuales/pedidos-manuales.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';

export interface IDetallePedido {
  id: number;
  id_detalle_pedido: string;
  Almacen: string;
  ListaP: string;
  Producto: string;
  CodArticulo: string;
  NombreArticulo: string;
  Cantidad: string;
  PrecioTotal: string;
  Observacion: string;
  UsuarioModificoDetalle: string;
  created_at: string;
  updated_at: string;
  Cajas: string;
  Paquetes: string;
}

export interface IOrdenesVenta {
  Id_pedido_Caja: string;
  Fecha_Pedido: string;
  Numero_Pedido: string;
  Almacen: string;
  Lista_P: string;
  Cantidad: string;
  PrecioTotal: string;
  UsuarioSAP: string;
  UsuarioGeneroPedido: string;
  UsuarioModificoPedido: string;
  created_at: string;
  Fecha_Factura: string;
  updated_at: string;
  Comentario_Inicial?: string;
  Comentario_Final?: string;
  Tipo_Pedido: string;
  DocNumSAP?: string;
  Fecha_Despacho: string;
  detalles?: IDetallePedido[];
}

@Component({
  selector: 'app-lista-pedidos-pendientes-sap',
  templateUrl: './lista-pedidos-pendientes-sap.component.html',
  styleUrls: ['./lista-pedidos-pendientes-sap.component.scss']
})
export class ListaPedidosPendientesSAPComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  cargarOrdenesVenta: boolean = false;
  errorLoadingData: boolean = false;
  enviadopedidosSAP: boolean = false;
  displayedColumns: string[] = [
    'select',
    'Acciones',
    'Id_pedido_Caja',
    'CodCliente',
    'Nombre_Almacen',
    'Tipo_Pedido',
    'created_at',
    'Fecha_Pedido',
    'Fecha_Factura',
    'Fecha_Despacho',
    'UsuarioGeneroPedido'
  ];

  dataSource = new MatTableDataSource<IOrdenesVenta>();
  selection = new SelectionModel<IOrdenesVenta>(true, []);

  columnAliases: { [key: string]: string } = {
    Id_pedido_Caja: 'ID Pedido/Caja',
    CodCliente: 'Cliente',
    Nombre_Almacen: 'Almacén Destino',
    Tipo_Pedido: 'Tipo Pedido',
    created_at: 'Fecha Pedido Automática',
    Fecha_Pedido: 'Fecha Pedido',
    Fecha_Despacho: 'Fecha Despacho',
    UsuarioGeneroPedido: 'Usuario Generó Pedido',
    Fecha_Factura: 'Fecha Factura',
  };

  constructor(
    private ordenesVentaService: OrdenesVentaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerOrdenesVenta();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  obtenerOrdenesVenta() {
    this.cargarOrdenesVenta = true;
    this.errorLoadingData = false;

    this.ordenesVentaService.ObtenerOrdenesVentaGTS().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.cargarOrdenesVenta = false;
      },
      (error) => {
        console.error('Error al obtener las órdenes de venta', error);
        this.errorLoadingData = true;
        this.cargarOrdenesVenta = false;

        let errorMessage = 'Ha ocurrido un error desconocido. Por favor, inténtelo de nuevo.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica que el servidor está en funcionamiento.';
        } else if (error.status === 500) {
          errorMessage = 'Ha ocurrido un error al procesar su solicitud. Inténtalo más tarde.';
        }

        Swal.fire('Error', errorMessage, 'error');
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleAllRows(event: MatCheckboxChange) {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
    } else {
      this.selection.clear();
    }
  }

  onRowCheckboxChange(event: MatCheckboxChange, row: IOrdenesVenta) {
    if (event.checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  confirmarGenerarPedidosEnSAP() {
    const selectedOrders = this.selection.selected;

    if (selectedOrders.length === 0) {
      Swal.fire('Sin selección', 'No hay pedidos seleccionados para generar en SAP.', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de generar ${selectedOrders.length} pedido(s) en SAP. ¿Deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.generarPedidosEnSAP(selectedOrders);
      }
    });
  }

  generarPedidosEnSAP(selectedOrders: IOrdenesVenta[]) {
    this.enviadopedidosSAP = true;
    const ids = selectedOrders.map((order) => order.Id_pedido_Caja);

    this.ordenesVentaService.generarPedidosEnSAP(ids).subscribe(
      (response) => {
        this.enviadopedidosSAP = false;

        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors
            .map((error: any) => `Pedido ID: ${error.idPedidoCaja}, Error Code: ${error.error?.code}, Error: ${error.error?.message?.value}`)
            .join('<br>');

          Swal.fire({
            title: 'Error',
            html: `Algunos pedidos no se pudieron enviar a SAP:<br>${errorMessages}`,
            icon: 'error'
          });
        } else {
          Swal.fire({
            title: 'Generación completada',
            text: 'Pedidos enviados a SAP correctamente.',
            icon: 'success'
          });
          this.obtenerOrdenesVenta();
        }
      },
      (error) => {
        this.enviadopedidosSAP = false;
        let errorMessage = 'Ha ocurrido un error al generar los pedidos en SAP.';
        Swal.fire('Error', errorMessage, 'error');
      }
    );
  }

  confirmarEliminarPedido(order: IOrdenesVenta) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar el pedido con ID ${order.Id_pedido_Caja}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarPedido(order.Id_pedido_Caja);
      }
    });
  }

  eliminarPedido(id_pedido_Caja: string) {
    this.ordenesVentaService.eliminarOrdenVenta(id_pedido_Caja).subscribe(
      () => {
        Swal.fire('Eliminado', 'El pedido ha sido eliminado correctamente.', 'success');
        this.obtenerOrdenesVenta();
      },
      (error) => {
        Swal.fire('Error', 'Ocurrió un error al intentar eliminar el pedido.', 'error');
      }
    );
  }

  abrircomponenteImportarPedidos() {
    const dialogRef = this.dialog.open(ImportarPedidosComponent, {
      width: 'auto',
      maxHeight: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.componentInstance.importCompleted.subscribe(() => {
      this.obtenerOrdenesVenta();
    });
  }

  abrirComponentePedidosManuales() {
    const dialogRef = this.dialog.open(PedidosManualesComponent, {
      width: 'auto',
      maxHeight: '500px',
      panelClass: 'custom-dialog-container'
    });
  }
  descargarTemplatePedidos() {
    const link = document.createElement('a');
    link.href = 'assets/Templates/TemplateCARGA.xlsx';
    link.download = 'TemplateCARGA.xlsx';
    link.click();
  }


  abrirdetalleOP(element: IOrdenesVenta) {
    this.ordenesVentaService.obtenerDetalleOrdenVenta(element.Id_pedido_Caja).subscribe(
      (data) => {
        const dialogRef = this.dialog.open(DetallePedidosComponent, {
          width: 'auto',
          maxHeight: '500px',
          panelClass: 'custom-dialog-container',
          data: { ordenVenta: element, detalles: data.detalles } // Accede a los detalles correctamente
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log('El diálogo se cerró');
        });
      },
      (error) => {
        console.error('Error al obtener los detalles de la orden de venta', error);
      }
    );
  }
  exportarPedidosAExcel(): void {
    const selectedOrders = this.selection.selected;

    if (selectedOrders.length === 0) {
      Swal.fire('Sin selección', 'No hay pedidos seleccionados para exportar.', 'warning');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheetEncabezados = workbook.addWorksheet('Encabezados Template');
    worksheetEncabezados.columns = [
      { header: 'ID Pedido/Caja', key: 'Id_pedido_Caja' },
      { header: 'Fecha Pedido', key: 'Fecha_Pedido' },
      { header: 'Número Pedido', key: 'Numero_Pedido' },
      { header: 'Almacén', key: 'Almacen' },
      { header: 'Lista P', key: 'Lista_P' },
      { header: 'Tipo Pedido', key: 'Tipo_Pedido' },
      { header: 'Cantidad', key: 'Cantidad' },
      { header: 'Precio Total', key: 'PrecioTotal' },
      { header: 'Usuario SAP', key: 'UsuarioSAP' },
      { header: 'Usuario Generó Pedido', key: 'UsuarioGeneroPedido' },
      { header: 'Usuario Modificó Pedido', key: 'UsuarioModificoPedido' },
      { header: 'Fecha Creación', key: 'created_at' },
      { header: 'Fecha Modificación', key: 'updated_at' },
      { header: 'Comentario Inicial', key: 'Comentario_Inicial' },
      { header: 'Comentario Final', key: 'Comentario_Final' },
      { header: 'Fecha_Factura', key: 'Fecha_Factura' },
      { header: 'Fecha_Despacho', key: 'Fecha_Despacho' },
      { header: 'DocNum SAP', key: 'DocNumSAP' }
    ];

    selectedOrders.forEach((order) => {
      worksheetEncabezados.addRow({
        Id_pedido_Caja: order.Id_pedido_Caja,
        Fecha_Pedido: order.Fecha_Pedido,
        Numero_Pedido: order.Numero_Pedido,
        Almacen: order.Almacen,
        Lista_P: order.Lista_P,
        Tipo_Pedido: order.Tipo_Pedido,
        Cantidad: order.Cantidad,
        PrecioTotal: order.PrecioTotal,
        UsuarioSAP: order.UsuarioSAP,
        UsuarioGeneroPedido: order.UsuarioGeneroPedido,
        UsuarioModificoPedido: order.UsuarioModificoPedido,
        created_at: order.created_at,
        updated_at: order.updated_at,
        Comentario_Inicial: order.Comentario_Inicial,
        Comentario_Final: order.Comentario_Final,
        Fecha_Factura: order.Fecha_Factura,
        Fecha_Despacho: order.Fecha_Despacho,
        DocNumSAP: order.DocNumSAP
      });
    });

    worksheetEncabezados.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' }
      };
      cell.font = { color: { argb: 'FFFFFFFF' } };
    });

    const worksheetDetalles = workbook.addWorksheet('Lineas');
    worksheetDetalles.columns = [
      { header: 'ID Pedido/Caja', key: 'Id_pedido_Caja' },
      { header: 'Almacén', key: 'Almacen' },
      { header: 'Lista P', key: 'ListaP' },
      { header: 'Producto', key: 'Producto' },
      { header: 'CodArticulo', key: 'CodArticulo' },
      { header: 'NombreArticulo', key: 'NombreArticulo' },
      { header: 'Cantidad', key: 'Cantidad' },
      { header: 'Precio Total', key: 'PrecioTotal' },
      { header: 'Observación', key: 'Observacion' },
      { header: 'Usuario Modificó Detalle', key: 'UsuarioModificoDetalle' },
      { header: 'Fecha Creación Detalle', key: 'created_at' },
      { header: 'Fecha Modificación Detalle', key: 'updated_at' },
      { header: 'Paquetes', key: 'Paquetes' },
      { header: 'Palets', key: 'Cajas' }
    ];

    const detallesPedidos = selectedOrders.flatMap((order) => {
      return order.detalles.map((detalle) => ({
        Id_pedido_Caja: order.Id_pedido_Caja,
        Almacen: detalle.Almacen,
        ListaP: detalle.ListaP,
        Producto: detalle.Producto,
        CodArticulo: detalle.CodArticulo,
        NombreArticulo: detalle.NombreArticulo,
        Cantidad: detalle.Cantidad,
        PrecioTotal: detalle.PrecioTotal,
        Observacion: detalle.Observacion,
        UsuarioModificoDetalle: detalle.UsuarioModificoDetalle,
        created_at: detalle.created_at,
        updated_at: detalle.updated_at,
        Cajas: detalle.Cajas,
        Paquetes: detalle.Paquetes
      }));
    });

    detallesPedidos.forEach((detalle) => {
      worksheetDetalles.addRow(detalle);
    });

    worksheetDetalles.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' }
      };
      cell.font = { color: { argb: 'FFFFFFFF' } };
    });

    const firstOrderId = selectedOrders[0].Id_pedido_Caja;

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `GTS-OrdenVenta-${firstOrderId}.xlsx`);
    });
  }
}
