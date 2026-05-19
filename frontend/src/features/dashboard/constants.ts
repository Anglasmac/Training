import type { DashboardStat, DashboardTab } from './types';

export const dashboardTabs: readonly DashboardTab[] = [
  { id: 'customers', label: 'Clientes', description: 'Número de documento, nombre completo, email, teléfono y dirección.' },
  { id: 'meals', label: 'Combos', description: 'Nombre único, categoría, descripción, precio y disponibilidad.' },
  { id: 'orders', label: 'Pedidos', description: 'Documento del cliente, UUID del combo, cantidad y totales.' },
] as const;

export const dashboardStatsByTab: Record<DashboardTab['id'], DashboardStat[]> = {
  customers: [
    { label: 'Campos requeridos', value: 5, detail: 'Número de documento, nombre completo, email, teléfono y dirección' },
    { label: 'Máx. documento', value: 20, detail: 'Incluye tipo y guion' },
    { label: 'Máx. dirección', value: 500, detail: 'Dirección completa de envío' },
  ],
  meals: [
    { label: 'Combos disponibles', value: 12 },
    { label: 'Precio promedio', value: '$18.500' },
    { label: 'Categorías', value: 7 },
  ],
  orders: [
    { label: 'Pedidos hoy', value: 42 },
    { label: 'Pendientes', value: 8 },
    { label: 'Ingresos', value: '$1.250.000' },
  ],
};

export const dashboardHighlightsByTab: Record<DashboardTab['id'], string[]> = {
  customers: [
    'Formato de documento TIPO-NÚMERO (CC-12345678)',
    'Teléfono: 7-10 dígitos',
    'Dirección completa hasta 500 caracteres',
  ],
  meals: ['Nombre único', 'Precio > 0', 'Disponibilidad por combo'],
  orders: ['Cantidad 1-99', 'Cálculo de IVA y totales'],
};
