import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { EditClientDialogComponent } from '../edit-client-dialog/edit-client-dialog';

@Component({
  selector: 'app-clientes-component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './clientes-component.html',
  styleUrl: './clientes-component.css',
})
export class ClientesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'contactEmail',
    'revenue',
    'startDate',
    'actions',
  ];
  dataSource = new MatTableDataSource<Client>();

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  clientes: Client[] = [];
  isLoading = false;
  errorMessage = '';
  searchValue = '';

  // Configuración de paginación
  totalClients = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];
  defaultPageSize = 10;

  constructor(
    private clientesService: ClientesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    console.log('🔧 ClientesSimpleComponent constructor');
  }

  ngOnInit() {
    console.log('🚀 ClientesSimpleComponent ngOnInit');
    this.loadClientes();
  }

  ngAfterViewInit() {
    console.log('👀 ngAfterViewInit ejecutado');
    console.log('📄 Paginator disponible:', !!this.paginator);
    console.log('🔃 Sort disponible:', !!this.sort);

    // Usar setTimeout
    setTimeout(() => {
      if (this.paginator) {
        console.log('✅ Conectando paginator al dataSource');
        this.dataSource.paginator = this.paginator;

        // Configurar etiquetas en español
        this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
        this.paginator._intl.nextPageLabel = 'Página siguiente';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.firstPageLabel = 'Primera página';
        this.paginator._intl.lastPageLabel = 'Última página';

        // Función personalizada para el rango
        this.paginator._intl.getRangeLabel = (
          page: number,
          pageSize: number,
          length: number
        ) => {
          if (length === 0 || pageSize === 0) {
            return `0 de ${length}`;
          }
          const startIndex = page * pageSize;
          const endIndex =
            startIndex < length
              ? Math.min(startIndex + pageSize, length)
              : startIndex + pageSize;
          return `${startIndex + 1} - ${endIndex} de ${length}`;
        };

        console.log('📄 Paginator configurado correctamente');
      } else {
        console.error('❌ Paginator NO está disponible');
      }

      if (this.sort) {
        console.log('✅ Conectando sort al dataSource');
        this.dataSource.sort = this.sort;
      } else {
        console.error('❌ Sort NO está disponible');
      }

      // Configurar filtro personalizado
      this.dataSource.filterPredicate = (data: Client, filter: string) => {
        const searchStr = filter.toLowerCase();
        return (
          data.name.toLowerCase().includes(searchStr) ||
          data.contactEmail.toLowerCase().includes(searchStr) ||
          data.revenue?.toString().includes(searchStr) ||
          false
        );
      };

      // Configurar ordenamiento personalizado
      this.dataSource.sortingDataAccessor = (
        data: Client,
        sortHeaderId: string
      ) => {
        switch (sortHeaderId) {
          case 'name':
            return data.name.toLowerCase();
          case 'contactEmail':
            return data.contactEmail.toLowerCase();
          case 'revenue':
            return data.revenue || 0;
          case 'startDate':
            return data.startDate ? new Date(data.startDate).getTime() : 0;
          case 'id':
            return data.id || 0;
          default:
            return '';
        }
      };

      console.log('🎯 Configuración completada');
    }, 0);
  }

  loadClientes() {
    console.log('📞 Iniciando carga de clientes con headers x-group-id...');
    this.isLoading = true;
    this.errorMessage = '';

    this.clientesService.getClients().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos exitosamente:', data);
        console.log('📊 Longitud:', data?.length);

        if (data && Array.isArray(data)) {
          this.clientes = data;
          this.totalClients = data.length;

          this.dataSource.data = [...this.clientes];

          console.log('🎉 DataSource actualizado con éxito!');
          console.log('📊 Total de clientes:', this.totalClients);

          // RECONECTAR PAGINADOR DESPUÉS DE CARGAR DATOS
          setTimeout(() => {
            this.reconnectPaginator();
          }, 100);
        } else {
          console.warn('⚠️ Los datos no son un array válido:', data);
          this.errorMessage = 'Los datos recibidos no son válidos';
          this.clientes = [];
          this.totalClients = 0;
          this.dataSource.data = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error completo:', error);
        this.errorMessage = `Error ${error.status}: ${
          error.message || error.statusText || 'Desconocido'
        }`;
        this.clientes = [];
        this.totalClients = 0;
        this.dataSource.data = [];
        this.isLoading = false;
      },
    });
  }

  // MÉTODO PARA RECONECTAR EL PAGINADOR
  private reconnectPaginator() {
    console.log('🔄 Reconectando paginador...');
    console.log('📄 Paginator disponible:', !!this.paginator);

    if (this.paginator && this.dataSource) {
      // Método 1: Desconectar y reconectar
      this.dataSource.paginator = null;

      setTimeout(() => {
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;

          // Ir a la primera página usando método público
          this.paginator.pageIndex = 0;

          // Disparar evento de cambio de página para forzar actualización
          this.paginator.page.emit({
            pageIndex: 0,
            pageSize: this.paginator.pageSize,
            length: this.dataSource.data.length,
          });

          console.log('✅ Paginador reconectado exitosamente');
          console.log('📄 Página actual:', this.paginator.pageIndex);
          console.log('📄 Total elementos:', this.dataSource.data.length);
        }
      }, 50);
    } else {
      console.error(
        '❌ No se puede reconectar - paginator o dataSource no disponible'
      );
    }
  }

  // Filtro de búsqueda
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Resetear a la primera página cuando se aplica un filtro
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    console.log('🔍 Filtro aplicado:', filterValue);
    console.log(
      '📊 Resultados filtrados:',
      this.dataSource.filteredData.length
    );
  }

  clearFilter() {
    this.searchValue = '';
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    console.log('🔍 Filtro limpiado');
  }

  // Métodos de navegación de páginas
  goToFirstPage() {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  goToLastPage() {
    if (this.paginator) {
      this.paginator.lastPage();
    }
  }

  // Información de paginación
  getPaginationInfo(): string {
    if (!this.paginator || this.totalClients === 0) {
      return 'Sin datos';
    }

    const start = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const end = Math.min(
      (this.paginator.pageIndex + 1) * this.paginator.pageSize,
      this.getFilteredTotal()
    );
    const total = this.getFilteredTotal();

    return `${start}-${end} de ${total}`;
  }

  getFilteredTotal(): number {
    return this.dataSource.filteredData.length;
  }

  editClient(client: Client) {
    console.log('✏️ Abriendo modal para editar cliente:', client);

    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      width: '650px',
      minWidth: '500px',
      maxWidth: '90vw',
      height: '620px',
      minHeight: '580px',
      maxHeight: '90vh',
      data: { client: client, isNew: false },
      disableClose: true,
      autoFocus: true,
      restoreFocus: true,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('🔄 Modal de edición cerrado con resultado:', result);

      if (result) {
        this.updateClientInAPI(client.id!, result);
      }
    });
  }

  addClient() {
    console.log('➕ Abriendo modal para nuevo cliente');

    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      width: '650px',
      minWidth: '500px', 
      maxWidth: '90vw', 
      height: '620px', 
      minHeight: '580px', 
      maxHeight: '90vh', 
      data: { client: null, isNew: true },
      disableClose: true,
      autoFocus: true,
      restoreFocus: true,
      panelClass: 'custom-dialog-container', 
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('🔄 Modal de nuevo cliente cerrado con resultado:', result);

      if (result) {
        this.createClientInAPI(result);
      }
    });
  }

  deleteClient(client: Client) {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${client.name}?`)) {
      console.log('🗑️ Eliminando cliente:', client);
      this.deleteClientInAPI(client.id!);
    }
  }

  // LLAMADAS REALES A LA API
  private createClientInAPI(clientData: Omit<Client, 'id'>) {
    console.log('➕ Creando cliente en API:', clientData);

    this.clientesService.createClient(clientData).subscribe({
      next: (newClient) => {
        console.log('✅ Cliente creado exitosamente en API:', newClient);

        // Agregar el nuevo cliente al inicio de la lista
        this.clientes.unshift(newClient);
        this.totalClients = this.clientes.length;
        this.dataSource.data = [...this.clientes];

        // Reconectar paginador y ir a primera página
        setTimeout(() => {
          this.reconnectPaginator();
          this.goToFirstPage();
        }, 100);

        this.showSnackBar('Cliente creado correctamente', 'success');
      },
      error: (error) => {
        console.error('❌ Error al crear cliente:', error);
        this.showSnackBar('Error al crear el cliente', 'error');
      },
    });
  }

  private updateClientInAPI(id: number, clientData: Partial<Client>) {
    console.log('🔄 Actualizando cliente en API:', { id, clientData });

    this.clientesService.updateClient(id, clientData).subscribe({
      next: (updatedClient) => {
        console.log(
          '✅ Cliente actualizado exitosamente en API:',
          updatedClient
        );

        // Actualizar el cliente en la lista local
        const index = this.clientes.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.clientes[index] = updatedClient;
          this.dataSource.data = [...this.clientes];

          // Reconectar paginador manteniendo página actual
          setTimeout(() => {
            this.reconnectPaginator();
          }, 100);
        }

        this.showSnackBar('Cliente actualizado correctamente', 'success');
      },
      error: (error) => {
        console.error('❌ Error al actualizar cliente:', error);
        this.showSnackBar('Error al actualizar el cliente', 'error');
      },
    });
  }

  private deleteClientInAPI(id: number) {
    console.log('🗑️ Eliminando cliente en API con ID:', id);

    this.clientesService.deleteClient(id).subscribe({
      next: () => {
        console.log('✅ Cliente eliminado exitosamente de la API');

        // Eliminar de la lista local
        this.clientes = this.clientes.filter((c) => c.id !== id);
        this.totalClients = this.clientes.length;
        this.dataSource.data = [...this.clientes];

        // Reconectar paginador
        setTimeout(() => {
          this.reconnectPaginator();
        }, 100);

        this.showSnackBar('Cliente eliminado correctamente', 'success');
      },
      error: (error) => {
        console.error('❌ Error al eliminar cliente:', error);
        this.showSnackBar('Error al eliminar el cliente', 'error');
      },
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info') {
    const config = {
      duration: 3000,
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${type}`],
    };

    this.snackBar.open(message, 'Cerrar', config);
  }
}
