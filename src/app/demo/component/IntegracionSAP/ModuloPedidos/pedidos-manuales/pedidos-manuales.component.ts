import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientesSapService } from 'src/app/Service/IntegracionSAP/clientes-sap.service';
import { ProductosSapService } from 'src/app/Service/IntegracionSAP/productos-sap.service';
import { OrdenesVentaService } from 'src/app/Service/IntegracionSAP/ordenes-venta.service';
import { debounceTime, switchMap, distinctUntilChanged, catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-manuales',
  templateUrl: './pedidos-manuales.component.html',
  styleUrls: ['./pedidos-manuales.component.scss']
})
export class PedidosManualesComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;
  details: any[] = [];
  productos: any[] = [];
  displayedColumns: string[] = ['CodArticulo', 'DescripcionArticulo', 'Cantidad', 'PrecioTotal'];
  consultandocliente: boolean = false;
  private destroy$ = new Subject<void>();

  private lastCodigoCliente: string = '';
  private lastCardName: string = '';

  constructor(
    private fb: FormBuilder,
    private clientesSapService: ClientesSapService,
    private productosService: ProductosSapService,
    private internalOrderService: OrdenesVentaService
  ) {
    this.orderForm = this.fb.group({
      CodigoCliente: [''],
      CardName: [''],
      Almacen: [''],
      ListaP: [0],
      Producto: [''],
      Cantidad: [''],
      PrecioTotal: [''],
      Observacion: [''],
      UsuarioModificoDetalle: [''],
      CodArticulo: [''],
      NombreArticulo: [''],
      DocNumSAP: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();

    this.orderForm.get('CodigoCliente')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value && value !== this.lastCodigoCliente) {
        this.searchClientByCode(value);
      } else if (!value) {
        this.orderForm.patchValue({ CardName: '' });
      }
    });

    this.orderForm.get('CardName')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value && value !== this.lastCardName) {
        this.searchClientByName(value);
      } else if (!value) {
        this.orderForm.patchValue({ CodigoCliente: '' });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchClientByCode(code: string) {
    this.consultandocliente = true;
    this.clientesSapService.consultarClienteSAP(code, null).pipe(
      catchError(error => {
        console.error('Error al consultar el cliente:', error);
        this.consultandocliente = false;
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe((response: any) => {
      if (response && response.value && response.value.length > 0) {
        const cliente = response.value[0];
        this.orderForm.patchValue({ CardName: cliente.CardName });
        this.lastCodigoCliente = code;
        this.lastCardName = cliente.CardName;
      } else {
        this.orderForm.patchValue({ CardName: '' });
        this.lastCodigoCliente = '';
      }
      this.consultandocliente = false;
    });
  }

  searchClientByName(name: string) {
    this.consultandocliente = true;
    this.clientesSapService.consultarClienteSAP(null, name).pipe(
      catchError(error => {
        console.error('Error al consultar el cliente:', error);
        this.consultandocliente = false;
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe((response: any) => {
      if (response && response.value && response.value.length > 0) {
        const cliente = response.value[0];
        this.orderForm.patchValue({ CodigoCliente: cliente.CardCode });
        this.lastCardName = name;
        this.lastCodigoCliente = cliente.CardCode;
      } else {
        this.orderForm.patchValue({ CodigoCliente: '' });
        this.lastCardName = '';
      }
      this.consultandocliente = false;
    });
  }

  addDetail() {
    if (this.orderForm.valid) {
      const detail = this.orderForm.value;
      detail.ListaP = Number(detail.ListaP);

      this.details.push({ ...detail });
      console.log('Detalles actuales:', this.details);

      this.orderForm.reset({
        CodigoCliente: this.orderForm.get('CodigoCliente')?.value,
        CardName: this.orderForm.get('CardName')?.value,
        Almacen: this.orderForm.get('Almacen')?.value,
        ListaP: this.orderForm.get('ListaP')?.value
      });
    } else {
      Swal.fire('Advertencia', 'Por favor, complete todos los campos requeridos.', 'warning');
    }
  }

  onSubmit() {
    if (this.orderForm.valid && this.details.length > 0) {
      const headers = this.orderForm.value;
      const orderData = {
        headers,
        details: this.details
      };

      console.log('Datos a enviar al backend:', orderData);

      this.internalOrderService.createInternalOrder(orderData).subscribe(
        response => {
          Swal.fire('Éxito', 'Pedido generado correctamente.', 'success');
          this.orderForm.reset();
          this.details = [];
        },
        error => {
          console.error('Error al generar el pedido:', error);
          Swal.fire('Error', 'No se pudo generar el pedido.', 'error');
        }
      );
    } else {
      Swal.fire('Advertencia', 'Por favor, complete todos los campos requeridos y agregue al menos un detalle.', 'warning');
    }
  }

  obtenerProductos() {
    this.productosService.ObtenerproductosGTS().subscribe(
      (data: any[]) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al obtener los productos', error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    );
  }

  onProductChange(itemCode: string) {
    const producto = this.productos.find(p => p.ItemCode === itemCode);
    if (producto) {
      this.orderForm.get('NombreArticulo')?.setValue(producto.ItemName);
    }
  }
}
