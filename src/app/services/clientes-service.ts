import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para el modelo Client
export interface Client {
  id?: number;
  name: string;
  contactEmail: string; // Cambiado de 'email' a 'contactEmail' según la API
  phone?: string;
  company?: string;
  address?: string;
  revenue?: number;
  startDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'https://clients-example-api.fly.dev/api/clients';
  private groupId = 4;

  constructor(private http: HttpClient) { }

  /**
   * GET - Obtener todos los clientes del grupo
   */
  getClients(): Observable<Client[]> {
    const headers = new HttpHeaders({
      'x-group-id': this.groupId.toString(),
      'Content-Type': 'application/json'
    });

    console.log('🔗 Llamando a API con headers:', headers.keys());
    console.log('🔗 URL:', this.apiUrl);
    console.log('🔗 Group ID:', this.groupId);

    return this.http.get<Client[]>(this.apiUrl, { headers });
  }

  /**
   * GET - Obtener un cliente por ID
   */
  getClientById(id: number): Observable<Client> {
    const headers = new HttpHeaders({
      'x-group-id': this.groupId.toString(),
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Client>(url, { headers });
  }

  /**
   * POST - Crear un nuevo cliente
   */
  createClient(client: Omit<Client, 'id'>): Observable<Client> {
    const headers = new HttpHeaders({
      'x-group-id': this.groupId.toString(),
      'Content-Type': 'application/json'
    });

    return this.http.post<Client>(this.apiUrl, client, { headers });
  }

  /**
   * PUT - Actualizar un cliente existente
   */
  updateClient(id: number, client: Partial<Client>): Observable<Client> {
    const headers = new HttpHeaders({
      'x-group-id': this.groupId.toString(),
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Client>(url, client, { headers });
  }

  /**
   * DELETE - Eliminar un cliente
   */
  deleteClient(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'x-group-id': this.groupId.toString(),
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, { headers });
  }

  /**
   * Método para validar email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Método para validar datos del cliente antes de enviar
   */
  validateClient(client: Partial<Client>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!client.name || client.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!client.contactEmail || !this.isValidEmail(client.contactEmail)) {
      errors.push('Debe proporcionar un email válido');
    }

    if (client.phone && client.phone.trim().length < 10) {
      errors.push('El teléfono debe tener al menos 10 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}