export type TabId = 'customers' | 'meals' | 'orders';

export type DashboardTab = {
  id: TabId;
  label: string;
  description: string;
};

export type DashboardStat = {
  label: string;
  value: string | number;
  detail?: string;
};
