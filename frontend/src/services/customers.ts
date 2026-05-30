import type {
  CustomerBase,
  CustomerCreate,
  CustomerListResponse,
  CustomerResponse,
  CustomerUpdate,
} from '../models/customers';
import { unwrapPaginatedResponse } from './listResponse';

const API_BASE_URL = '/api';

export const customerService = {
  async getAll(page = 1, pageSize = 10): Promise<CustomerListResponse> {
    const response = await fetch(
      `${API_BASE_URL}/customers/?page=${page}&page_size=${pageSize}`
    );
    if (!response.ok) throw new Error('Error al obtener lista de clientes');
    const payload = await response.json();
    const normalized = unwrapPaginatedResponse<
      CustomerListResponse['customers'][number]
    >(payload, 'customers');

    return {
      customers: normalized.items,
      total: normalized.total,
      page: normalized.page,
      page_size: normalized.pageSize,
      total_pages: normalized.totalPages,
    };
  },
  async getByDocument(document: string): Promise<CustomerResponse> {
    const response = await fetch(`${API_BASE_URL}/customers/${document}`);
    if (!response.ok) throw new Error('Error al obtener cliente');
    return response.json();
  },

  async create(customer: CustomerCreate): Promise<CustomerResponse> {
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
