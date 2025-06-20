import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material imports
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Client } from '../../services/clientes-service';

interface DialogData {
  client: Client | null;
  isNew: boolean;
}

@Component({
  selector: 'app-edit-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-client-dialog.html',
  styleUrl: './edit-client-dialog.css'
})
export class EditClientDialogComponent implements OnInit {
  clientForm: FormGroup;
  isNew: boolean;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isNew = data.isNew;
    this.clientForm = this.createForm();
  }

  ngOnInit() {
    if (!this.isNew && this.data.client) {
      this.loadClientData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      revenue: ['', [Validators.min(0)]],
      startDate: ['']
    });
  }

  private loadClientData() {
    if (this.data.client) {
      console.log('📝 Cargando datos del cliente:', this.data.client);
      console.log('📅 StartDate original:', this.data.client.startDate);
      
      // Convertir startDate desde string ISO a Date object
      let startDate = null;
      if (this.data.client.startDate) {
        try {
          // La API devuelve: "2025-04-09T23:20:50.000Z"
          startDate = new Date(this.data.client.startDate);
          console.log('📅 StartDate convertida a Date:', startDate);
          console.log('📅 StartDate es válida:', !isNaN(startDate.getTime()));
        } catch (error) {
          console.error('❌ Error al convertir fecha:', error);
          startDate = null;
        }
      }

      this.clientForm.patchValue({
        name: this.data.client.name,
        contactEmail: this.data.client.contactEmail,
        revenue: this.data.client.revenue || '',
        startDate: startDate
      });
      
      console.log('📝 Valores del formulario después de cargar:', this.clientForm.value);
    }
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.isSubmitting = true;
      
      const formData = this.clientForm.value;
      console.log('💾 Datos del formulario antes de procesar:', formData);
      
      // Formatear la fecha al formato que espera la API
      if (formData.startDate && formData.startDate instanceof Date) {
        // Convertir Date a string ISO (formato: "2025-04-09T23:20:50.000Z")
        formData.startDate = formData.startDate.toISOString();
        console.log('📅 Fecha convertida a ISO:', formData.startDate);
      } else if (formData.startDate === '') {
        // Si el campo está vacío, enviar null
        formData.startDate = null;
      }

      // Convertir revenue a número
      if (formData.revenue && formData.revenue !== '') {
        formData.revenue = parseFloat(formData.revenue);
        console.log('💰 Revenue convertido:', formData.revenue);
      } else {
        formData.revenue = null;
      }

      console.log('💾 Datos finales preparados para la API:', formData);

      // Preparar datos para devolver al componente padre
      const clientData: Partial<Client> = {
        name: formData.name,
        contactEmail: formData.contactEmail,
        revenue: formData.revenue,
        startDate: formData.startDate
      };

      // Si estamos editando, incluir el ID
      if (!this.isNew && this.data.client?.id) {
        (clientData as Client).id = this.data.client.id;
      }

      console.log('✅ Datos preparados para devolver:', clientData);

      // Cerrar modal inmediatamente y devolver los datos
      // El componente padre se encargará de la llamada a la API
      this.isSubmitting = false;
      this.dialogRef.close(clientData);
      
    } else {
      this.markFormGroupTouched();
      this.showSnackBar('Por favor, corrija los errores en el formulario', 'error');
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  // Método para formatear la fecha para mostrar en el input
  formatDateForDisplay(dateString: string | null): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Formato DD/MM/YYYY para mostrar
      return date.toLocaleDateString('es-ES');
    } catch (error) {
      console.error('Error al formatear fecha para mostrar:', error);
      return '';
    }
  }

  // Método para obtener solo la fecha sin hora (para el datepicker)
  getDateOnly(dateString: string | null): Date | null {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      // Crear nueva fecha solo con día/mes/año (sin hora)
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } catch (error) {
      console.error('Error al obtener solo fecha:', error);
      return null;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    const config = {
      duration: 3000,
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const,
      panelClass: [`snackbar-${type}`]
    };
    
    this.snackBar.open(message, 'Cerrar', config);
  }

  // Getters para facilitar la validación en el template
  get name() { return this.clientForm.get('name'); }
  get contactEmail() { return this.clientForm.get('contactEmail'); }
  get revenue() { return this.clientForm.get('revenue'); }
  get startDate() { return this.clientForm.get('startDate'); }
}