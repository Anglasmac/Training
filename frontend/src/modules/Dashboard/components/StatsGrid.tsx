import type { DashboardStat } from '../types';

const StatsGrid = ({ items }: { items: DashboardStat[] }) => {
  return (
    <section className='stats-grid'>
      {items.map(item => (
        <article key={item.label} className='stat-card'>
          <span className='stat-label'>{item.label}</span>
          <strong className='stat-value'>{item.value}</strong>
          {item.detail && <span className='stat-detail'>{item.detail}</span>}
        </article>
      ))}
    </section>
  );
};

export default StatsGrid;
