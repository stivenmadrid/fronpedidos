import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'; // Importa MatDialog y MatDialogConfig
import { MesasService } from 'src/app/Service/Mesas/mesas.service';
import { RegistrarPedidosComponent } from '../registrar-pedidos/registrar-pedidos.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  mesas: any[] = [];

  constructor(
    private mesasrestaurante: MesasService,
    private dialog: MatDialog // Inyecta MatDialog
  ) {}

  ngOnInit(): void {
    this.GetMesas();
  }

  GetMesas() {
    this.mesasrestaurante.obtenerMesasRestaurante().subscribe(
      (data: any) => {
        this.mesas = data;
      },
      (error) => {
        console.error('Error al obtener las mesas:', error);
      }
    );
  }

  abrirModalRegistrarPedidos(requisicion: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = requisicion;
    const dialogRef = this.dialog.open(RegistrarPedidosComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => console.log('El modal se ha cerrado'));
  }

}
