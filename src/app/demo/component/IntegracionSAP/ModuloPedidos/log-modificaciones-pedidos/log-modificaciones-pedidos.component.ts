import { Component, OnInit } from '@angular/core';
import { OrdenesVentaService } from 'src/app/Service/IntegracionSAP/ordenes-venta.service';

@Component({
  selector: 'app-log-modificaciones-pedidos',
  templateUrl: './log-modificaciones-pedidos.component.html',
  styleUrls: ['./log-modificaciones-pedidos.component.scss']
})
export class LogModificacionesPedidosComponent implements OnInit {
  modificaciones: any[] = [];
  groupedModificaciones: any[] = [];
  filteredModificaciones: any[] = []; // Array filtrado
  detailColumns: string[] = ['campo_modificado', 'valor_anterior', 'valor_nuevo', 'usuario_nombre', 'created_at'];

  constructor(private modificacionesService: OrdenesVentaService) { }

  ngOnInit(): void {
    this.loadModificaciones();
  }

  loadModificaciones(): void {
    this.modificacionesService.getModificacionesPedidos().subscribe(
      data => {
        this.modificaciones = data;
        this.groupByPedidoId();
        this.filteredModificaciones = [...this.groupedModificaciones]; // Inicialmente mostrar todo
      },
      error => {
        console.error('Error fetching modificaciones', error);
      }
    );
  }

  groupByPedidoId(): void {
    const grouped = this.modificaciones.reduce((acc, modification) => {
      const { pedido_id, ...rest } = modification;
      if (!acc[pedido_id]) {
        acc[pedido_id] = { pedido_id, details: [] };
      }
      acc[pedido_id].details.push(rest);
      return acc;
    }, {});

    this.groupedModificaciones = Object.values(grouped);
  }

  // Método para filtrar los pedidos por Pedido ID
  applyFilter(filterValue: string): void {
    const lowerValue = filterValue.toLowerCase();
    this.filteredModificaciones = this.groupedModificaciones.filter(modification =>
      modification.pedido_id.toLowerCase().includes(lowerValue)
    );
  }
}
