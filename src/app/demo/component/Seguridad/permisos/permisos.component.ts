  import { Component, OnInit } from '@angular/core';
  import { MatTableDataSource } from '@angular/material/table';
  import { MatDialog } from '@angular/material/dialog';
  import { PermissionsService } from 'src/app/Service/Usuarios/permissions.service';
  import { RegistrarpermisosComponent } from './registrarpermisos/registrarpermisos.component';
  import { EditarpermisosComponent } from './editarpermisos/editarpermisos.component';
  
  @Component({
    selector: 'app-permisos',
    templateUrl: './permisos.component.html',
    styleUrls: ['./permisos.component.scss']
  })
  export class PermisosComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'guard_name', 'created_at', 'updated_at', 'actions'];



  
    columnAliases: { [key: string]: string } = {
      'id': 'ID',
      'name': 'Nombre',
      'guard_name': 'Guardia',
      'created_at': 'Fecha de Creación',
      'updated_at': 'Fecha de Actualización',
      'actions' : 'actions'
    };
  
    dataSource = new MatTableDataSource<any>();
    permisos: any[] = [];
  
    constructor(
      private permisosService: PermissionsService,
      private dialog: MatDialog
    ) { }
  
    ngOnInit(): void {
      this.obtenerpermisos();
    }
  
    obtenerpermisos() {
      this.permisosService.obtenerPermisos().subscribe(
        (permisos: any[]) => {
          this.permisos = permisos;
          this.dataSource.data = permisos;
        },
        error => {
          console.error('Error al obtener los permisos:', error);
        }
      );
    }
  
    getCellValue(permission: any, column: string): string {
      return permission[column];
    }
  
    openRegistrarPermisosModal() {
      // Abre el modal de registro de permisos
      const dialogRef = this.dialog.open(RegistrarpermisosComponent, {
        width: '400px', // Ancho del modal
        data: {} // Puedes pasar datos al modal si es necesario
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // Lógica que se ejecuta después de que se cierra el modal (opcional)
        console.log('El modal se ha cerrado');
        // Actualiza la lista de permisos después de cerrar el modal, si es necesario
        if (result) {
          this.obtenerpermisos();
        }
      });
    }

    openEditarPermisosModal(id: number) {
      const dialogRef = this.dialog.open(EditarpermisosComponent, {
        width: '400px',
        data: { permissionId: id }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.obtenerpermisos();
        }
      });
    }
    
    
  }
  