import { dashboardHighlightsByTab, dashboardStatsByTab, dashboardTabs } from './constants';
import { Hero, Panel } from './components';
import StatsGrid from './components/StatsGrid';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchDashboardData();
      setData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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
    <>
      <Hero title={currentTab.label} subtitle={currentTab.description} badge='Solo front' />

      {loading && <div className='loading'>Cargando métricas del dashboard…</div>}
      {error && (
        <div className='alert alert-error'>
          <div>Error al cargar estadísticas: {error}</div>
          <div style={{ marginTop: 8 }}>
            <button className='tab-button' onClick={load} type='button'>Reintentar</button>
          </div>
        </div>
      )}
      {!loading && !error && <StatsGrid items={stats} />}

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
    </>
  );
};

export default DashboardScreen;
