import type {
  OrderCreate,
  OrderListResponse,
  OrderResponse,
  OrderUpdate,
} from '../models/orders';
import { unwrapPaginatedResponse } from './listResponse';

const API_BASE_URL = '/api';

const normalizeOrder = (order: OrderResponse): OrderResponse => ({
  ...order,
  subtotal_without_iva: Number(order.subtotal_without_iva),
  iva_amount: Number(order.iva_amount),
  total_with_iva: Number(order.total_with_iva),
});

export const orderService = {
  async getAll(page = 1, pageSize = 10): Promise<OrderListResponse> {
    const response = await fetch(
      `${API_BASE_URL}/orders/?page=${page}&page_size=${pageSize}`
    );
    if (!response.ok) throw new Error('Error al obtener pedidos');
    const payload = await response.json();
    const normalized = unwrapPaginatedResponse<OrderResponse>(
      payload,
      'orders'
    );

    return {
      orders: normalized.items.map(normalizeOrder),
      total: normalized.total,
      page: normalized.page,
      page_size: normalized.pageSize,
      total_pages: normalized.totalPages,
    };
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
    return normalizeOrder(await response.json());
  },

  async update(uuid: string, order: OrderUpdate): Promise<OrderResponse> {
    const response = await fetch(`${API_BASE_URL}/orders/${uuid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Error al actualizar pedido');
    return normalizeOrder(await response.json());
  },
};
