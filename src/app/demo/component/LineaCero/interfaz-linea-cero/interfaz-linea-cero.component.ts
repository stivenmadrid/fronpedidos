import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LineaCeroServiceService } from 'src/app/Service/LineaCero/linea-cero-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-interfaz-linea-cero',
  templateUrl: './interfaz-linea-cero.component.html',
  styleUrls: ['./interfaz-linea-cero.component.scss']
})
export class InterfazLineaCeroComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  searchTerm: string = '';
  loadingLineaCero: boolean = false;

  displayedColumns: string[] = ['id', 'datetime', 'modbus_var1', 'modbus_var2', 'modbus_var3', 'modbus_var4', 'modbus_var5', 'modbus_var6'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private lineaCeroService: LineaCeroServiceService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchData(): void {
    this.loadingLineaCero = true;  // Show loading spinner
    this.lineaCeroService.getLineaCeroData().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.loadingLineaCero = false;  // Hide loading spinner
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loadingLineaCero = false;  // Hide loading spinner on error
  
        // Display SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar datos',
          text: 'No se pudieron cargar los datos de Línea Cero. Intente nuevamente más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
  

  search(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }
}
