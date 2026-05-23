import type { MealCreate, MealUpdate, MealResponse } from '../models/meals';

const VITE_BASE = import.meta.env.VITE_API_URL ?? '';
const API_BASE_URL = VITE_BASE ? VITE_BASE.replace(/\/$/, '') : '';

export const mealService = {
  async getAll(): Promise<MealResponse[]> {
    const response = await fetch(`${API_BASE_URL}/meals/`);
    if (!response.ok) throw new Error('Error al obtener combos');
    return response.json();
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
