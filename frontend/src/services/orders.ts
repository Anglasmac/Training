import type { OrderCreate, OrderResponse, OrderUpdate } from '../models/orders';

const VITE_BASE = import.meta.env.VITE_API_URL ?? '';
const API_BASE_URL = VITE_BASE ? `${VITE_BASE.replace(/\/$/, '')}/api` : '/api';

export const orderService = {
  async getAll(): Promise<OrderResponse[]> {
    const response = await fetch(`${API_BASE_URL}/orders/`);
    if (!response.ok) throw new Error('Error al obtener pedidos');
    return response.json();
  },

  async getById(uuid: string): Promise<OrderResponse> {
    const response = await fetch(`${API_BASE_URL}/orders/${uuid}`);
    if (!response.ok) throw new Error('Error al obtener pedido');
    return response.json();
  },

  async getByDocument(document: string): Promise<OrderResponse[]> {
    const response = await fetch(
      `${API_BASE_URL}/orders/by-document/${document}`
    );
    if (!response.ok) throw new Error('Error al obtener pedidos del cliente');
    return response.json();
  },

  async create(order: OrderCreate): Promise<OrderResponse> {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear pedido');
    }
    return response.json();
  },

  async update(uuid: string, order: OrderUpdate): Promise<OrderResponse> {
    const response = await fetch(`${API_BASE_URL}/orders/${uuid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Error al actualizar pedido');
    return response.json();
  },

  async delete(uuid: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/orders/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar pedido');
  },
};
