import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';  

@Component({
  selector: 'app-editar-detalles',
  templateUrl: './editar-detalles.component.html',
  styleUrls: ['./editar-detalles.component.scss']
})
export class EditarDetallesComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditarDetallesComponent>
  ) { }

  save() {
    this.dialogRef.close(this.data); 
  }

  cancel() {
    this.dialogRef.close(); 
  }
}
