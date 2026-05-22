import { customerService } from '../../services/customers';
import { mealService } from '../../services/meals';
import { orderService } from '../../services/orders';
import type { OrderStats } from '../../models/orders';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type DashboardData = {
  customersCount: number;
  mealsCount: number;
  mealsAvailable: number;
  orders: OrderStats;
};

/**
 * Tries to fetch a single dashboard summary from the backend (`/dashboard/summary`).
 * If the endpoint is not available (404 or network error), falls back to fetching
 * each resource individually using the existing services.
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const resp = await fetch(`${API_BASE_URL}/dashboard/summary`);
    if (resp.ok) {
      const json = await resp.json();
      // Expecting shape: { customersCount, mealsCount, mealsAvailable, orders: { ... } }
      return {
        customersCount: json.customersCount ?? 0,
        mealsCount: json.mealsCount ?? 0,
        mealsAvailable: json.mealsAvailable ?? 0,
        orders:
          json.orders ??
          ({
            total: 0,
            pending: 0,
            delivered: 0,
            totalRevenue: 0,
            pendingRevenue: 0,
            deliveredRevenue: 0,
          } as OrderStats),
      };
    }
  } catch {
    // ignore and fallback
  }

  // Fallback: request each resource separately
  const [customers, meals, orders] = await Promise.all([
    customerService.getAll(),
    mealService.getAll(),
    orderService.getAll(),
  ]);

  const mealsAvailable = meals.filter(m => m.is_available ?? true).length;

  const totalOrders = orders.length;
  const pending = orders.filter(o => !o.is_delivered).length;
  const delivered = orders.filter(o => o.is_delivered).length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total_with_iva ?? 0),
    0
  );

  const orderStats: OrderStats = {
    total: totalOrders,
    pending,
    delivered,
    totalRevenue,
    pendingRevenue: orders
      .filter(o => !o.is_delivered)
      .reduce((s, o) => s + (o.total_with_iva ?? 0), 0),
    deliveredRevenue: orders
      .filter(o => o.is_delivered)
      .reduce((s, o) => s + (o.total_with_iva ?? 0), 0),
  };

  return {
    customersCount: Array.isArray(customers) ? customers.length : 0,
    mealsCount: Array.isArray(meals) ? meals.length : 0,
    mealsAvailable,
    orders: orderStats,
  };
};

export default fetchDashboardData;
