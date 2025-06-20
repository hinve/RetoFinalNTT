import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

//Services
import { ClientesService, Client } from '../../services/clientes-service';



@Component({
  selector: 'app-clientes-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './clientes-component.html',
  styleUrl: './clientes-component.css'
})
export class ClientesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'contactEmail', 'revenue', 'startDate', 'actions'];
  dataSource = new MatTableDataSource<Client>();
  
  clientes: Client[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private clientesService: ClientesService) {
    console.log('🔧 ClientesSimpleComponent constructor');
  }

  ngOnInit() {
    console.log('🚀 ClientesSimpleComponent ngOnInit');
    this.loadClientes();
  }

  loadClientes() {
    console.log('📞 Iniciando carga de clientes con headers x-group-id...');
    this.isLoading = true;
    this.errorMessage = '';
    
    this.clientesService.getClients().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos exitosamente:', data);
        console.log('📊 Tipo de data:', typeof data);
        console.log('📊 Es array:', Array.isArray(data));
        console.log('📊 Longitud:', data?.length);
        
        if (data && Array.isArray(data) && data.length > 0) {
          console.log('🎯 Primer cliente:', data[0]);
          console.log('🎯 Campos disponibles:', Object.keys(data[0]));
          
          this.clientes = data;
          this.dataSource.data = this.clientes;
          console.log('🎉 DataSource actualizado con éxito!');
        } else if (data && Array.isArray(data) && data.length === 0) {
          console.log('⚠️ La API devolvió un array vacío');
          this.errorMessage = 'No hay clientes disponibles';
          this.clientes = [];
          this.dataSource.data = [];
        } else {
          console.warn('⚠️ Los datos no son un array válido:', data);
          this.errorMessage = 'Los datos recibidos no son válidos';
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error completo:', error);
        console.error('📋 Error message:', error.message);
        console.error('📋 Error status:', error.status);
        console.error('📋 Error statusText:', error.statusText);
        console.error('📋 Error url:', error.url);
        
        this.errorMessage = `Error ${error.status}: ${error.message || error.statusText || 'Desconocido'}`;
        this.isLoading = false;
      }
    });
  }

  editClient(client: Client) {
    console.log('✏️ Editar cliente:', client);
    alert(`Editar cliente:\n\nNombre: ${client.name}\nEmail: ${client.contactEmail}\nIngresos: ${client.revenue}`);
  }

  deleteClient(client: Client) {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${client.name}?`)) {
      console.log('🗑️ Eliminar cliente:', client);
      // TODO: Implementar eliminación real
      this.clientesService.deleteClient(client.id!).subscribe({
        next: () => {
          console.log('✅ Cliente eliminado exitosamente');
          this.loadClientes(); // Recargar la lista
        },
        error: (error) => {
          console.error('❌ Error al eliminar:', error);
          alert('Error al eliminar el cliente');
        }
      });
    }
  }
}