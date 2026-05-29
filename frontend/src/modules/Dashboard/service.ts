import type { OrderStats } from '../../models/orders';

const API_BASE_URL = '/api';

export type DashboardData = {
  customersCount: number;
  mealsCount: number;
  mealsAvailable: number;
  orders: OrderStats;
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const resp = await fetch(`${API_BASE_URL}/dashboard/summary`);
    if (resp.ok) {
      const json = await resp.json();
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

  const [customersResp, mealsResp, ordersResp] = await Promise.all([
    fetch(`${API_BASE_URL}/customers/`),
    fetch(`${API_BASE_URL}/meals/`),
    fetch(`${API_BASE_URL}/orders/`),
  ]);

  const customers: Record<string, unknown>[] = customersResp.ok ? await customersResp.json() : [];
  const meals: { is_available?: boolean }[] = mealsResp.ok ? await mealsResp.json() : [];
  const orders: { is_delivered?: boolean; total_with_iva?: number }[] = ordersResp.ok ? await ordersResp.json() : [];

  const mealsAvailable = meals.filter(m => m.is_available !== false).length;

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
