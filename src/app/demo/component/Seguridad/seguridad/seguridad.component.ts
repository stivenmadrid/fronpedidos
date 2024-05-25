import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosService } from 'src/app/Service/Usuarios/usuarios.service';

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrl: './seguridad.component.scss'
})


export class SeguridadComponent {

  displayedColumns: string[] = ['id','name', 'email'];
  dataSource = new MatTableDataSource<any>();
  usuarios: any[] = [];

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe(
      (usuarios: any[]) => {
        this.usuarios = usuarios; // Asignar los usuarios obtenidos a la propiedad usuarios
        this.dataSource.data = usuarios;
        console.log(usuarios);
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
}
