import { dashboardHighlightsByTab, dashboardStatsByTab, dashboardTabs } from './constants';
import { Hero, Panel, Sidebar, StatsGrid } from './components';
import type { TabId, DashboardStat } from './types';
import { useEffect, useState } from 'react';
import { fetchDashboardData } from './service';
import type { DashboardData } from './service';

interface DashboardScreenProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const DashboardScreen = ({ activeTab, onTabChange }: DashboardScreenProps) => {
  const currentTab = dashboardTabs.find(tab => tab.id === activeTab) ?? dashboardTabs[0];
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData().then(setData).catch(() => undefined);
  }, []);

  const stats: DashboardStat[] = data
    ? activeTab === 'customers'
      ? [
          { label: 'Clientes registrados', value: data.customersCount },
          { label: 'Máx. documento', value: 20 },
          { label: 'Máx. dirección', value: 500 },
        ]
      : activeTab === 'meals'
      ? [
          { label: 'Combos totales', value: data.mealsCount },
          { label: 'Disponibles', value: data.mealsAvailable },
          { label: 'Precio promedio', value: '$18.500' },
        ]
      : [
          { label: 'Pedidos totales', value: data.orders.total },
          { label: 'Pendientes', value: data.orders.pending },
          { label: 'Ingresos', value: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(data.orders.totalRevenue) },
        ]
    : dashboardStatsByTab[activeTab];

  const highlights = dashboardHighlightsByTab[activeTab];

  return (
    <div className='app-shell'>
      <Sidebar activeTab={activeTab} onNavigate={onTabChange} />

      <main className='main-content'>
        <Hero title={currentTab.label} subtitle={currentTab.description} badge='Solo front' />

        <StatsGrid items={stats} />

        <nav className='tabs-inline' aria-label='Secciones'>
          {dashboardTabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${tab.id === activeTab ? 'is-active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              type='button'
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className='content-grid'>
          <Panel title='Contrato activo'>
            <p>{currentTab.description}</p>
          </Panel>

          <Panel title='Puntos clave'>
            <ul>
              {highlights.map(highlight => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </Panel>
        </section>
      </main>
    </div>
  );
};

export default DashboardScreen;
