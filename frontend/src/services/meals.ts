import type {
  MealCreate,
  MealUpdate,
  MealResponse,
  MealListResponse,
} from '../models/meals';
import { unwrapPaginatedResponse } from './listResponse';

const API_BASE_URL = '/api';

export const mealService = {
  async getAll(page = 1, pageSize = 10): Promise<MealListResponse> {
    const response = await fetch(
      `${API_BASE_URL}/meals/?page=${page}&page_size=${pageSize}`
    );
    if (!response.ok) throw new Error('Error al obtener combos');
    const payload = await response.json();
    const normalized = unwrapPaginatedResponse<MealResponse>(payload, 'meals');

    return {
      meals: normalized.items,
      total: normalized.total,
      page: normalized.page,
      page_size: normalized.pageSize,
      total_pages: normalized.totalPages,
    };
  },

  async getById(uuid: string): Promise<MealResponse> {
    const response = await fetch(`${API_BASE_URL}/meals/${uuid}`);
    if (!response.ok) throw new Error('Error al obtener combo');
    return response.json();
  },

  async create(meal: MealCreate): Promise<MealResponse> {
    const response = await fetch(`${API_BASE_URL}/meals/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meal),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear combo');
    }
    return response.json();
  },

  async update(uuid: string, meal: MealUpdate): Promise<MealResponse> {
    const response = await fetch(`${API_BASE_URL}/meals/${uuid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meal),
    });
    if (!response.ok) throw new Error('Error al actualizar combo');
    return response.json();
  },

  async delete(uuid: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/meals/${uuid}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar combo');
  },
};
