import type {
  CustomerBase,
  CustomerCreate,
  CustomerUpdate,
} from '../models/customers';

const VITE_BASE = import.meta.env.VITE_API_URL ?? '';
const API_BASE_URL = VITE_BASE ? VITE_BASE.replace(/\/$/, '') : '';

export const customerService = {
  async getAll(): Promise<import('../models/customers').CustomerResponse[]> {
    const response = await fetch(`${API_BASE_URL}/customers/`);
    if (!response.ok) throw new Error('Error al obtener lista de clientes');
    return response.json();
  },
  async getByDocument(
    document: string
  ): Promise<
    CustomerBase & { uuid: string; created_at: string; updated_at?: string }
  > {
    const response = await fetch(`${API_BASE_URL}/customers/${document}`);
    if (!response.ok) throw new Error('Error al obtener cliente');
    return response.json();
  },

  async create(
    customer: CustomerCreate
  ): Promise<CustomerBase & { uuid: string; created_at: string }> {
    const response = await fetch(`${API_BASE_URL}/customers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear cliente');
    }
    return response.json();
  },

  async update(
    document: string,
    customer: CustomerUpdate
  ): Promise<Partial<CustomerBase>> {
    const response = await fetch(`${API_BASE_URL}/customers/${document}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (!response.ok) throw new Error('Error al actualizar cliente');
    // Backend returns 204 No Content, so we return the updated fields
    return customer;
  },

  async delete(document: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customers/${document}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar cliente');
  },
};
