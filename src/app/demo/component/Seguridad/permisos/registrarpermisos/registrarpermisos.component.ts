import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PermissionsService } from '../../../../../Service/Usuarios/permissions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrarpermisos',
  templateUrl: './registrarpermisos.component.html',
  styleUrls: ['./registrarpermisos.component.scss']
})
export class RegistrarpermisosComponent implements OnInit {

  newPermission: any = { name: '', guard_name: 'web' };
  registroError: string | null = null;
  registrorol: boolean = false;

  constructor(
    private permissionsService: PermissionsService,
    private dialogRef: MatDialogRef<RegistrarpermisosComponent>
  ) { }

  ngOnInit(): void {
  }

  registerPermission() {
    this.registrorol = true;
    this.permissionsService.createPermission(this.newPermission).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Permiso creado exitosamente'
        });
        this.dialogRef.close(true); // Envía un valor booleano al cerrar el modal
      },
      (error) => {
        console.error('Error al crear el permiso:', error);
        this.registroError = error.error.message || "Error al crear el permiso";
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.registroError
        });
      }
    ).add(() => {
      this.registrorol = false;
    });
  }

  onCancel() {
    this.dialogRef.close(false); // Envía un valor booleano al cerrar el modal
  }
}
