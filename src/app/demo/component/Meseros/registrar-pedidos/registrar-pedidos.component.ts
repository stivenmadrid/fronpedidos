import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/Service/Categorias/categorias.service';

@Component({
  selector: 'app-registrar-pedidos',
  templateUrl: './registrar-pedidos.component.html',
  styleUrls: ['./registrar-pedidos.component.scss']
})
export class RegistrarPedidosComponent implements OnInit {

  productosSeleccionados: any[] = [];
  categorias: any[] = [];

  constructor(private categoriasproductos: CategoriasService) {}

  ngOnInit(): void {
    this.ObtenerCategoria();
  }

  generarPedido() {
    console.log("Pedido generado:", this.productosSeleccionados);
    this.productosSeleccionados = [];
  }

  agregarAlCarrito(producto: any) {
    const index = this.productosSeleccionados.findIndex(item => item.nombre === producto.nombre);
    if (index !== -1) {
      this.productosSeleccionados[index].cantidad++;
    } else {
      producto.cantidad = 1;
      this.productosSeleccionados.push(producto);
    }
  }

  aumentarCantidad(index: number) {
    this.productosSeleccionados[index].cantidad++;
  }

  disminuirCantidad(index: number) {
    if (this.productosSeleccionados[index].cantidad > 1) {
      this.productosSeleccionados[index].cantidad--;
    }
  }

  quitarDelCarrito(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  calcularTotal() {
    let total = 0;
    for (const producto of this.productosSeleccionados) {
      total += producto.precio * producto.cantidad;
    }
    return total;
  }

  ObtenerCategoria(): void {
    this.categoriasproductos.ObtenerCategoria().subscribe(
      (data: any) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }
}
