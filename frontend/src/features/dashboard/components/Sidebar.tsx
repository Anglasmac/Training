import type { TabId } from '../types';
import { dashboardTabs } from '../constants';

type SidebarProps = {
  activeTab?: TabId;
  onNavigate?: (tab: TabId) => void;
};

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case 'dashboard':
      return (
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='nav-icon'>
          <rect x='3' y='3' width='8' height='8' rx='2' stroke='currentColor' strokeWidth='1.4' />
          <rect x='13' y='3' width='8' height='18' rx='2' stroke='currentColor' strokeWidth='1.4' />
        </svg>
      );
    case 'orders':
      return (
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='nav-icon'>
          <path d='M3 7h18' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
          <path d='M7 11h10' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
          <path d='M9 15h6' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
        </svg>
      );
    case 'tables':
    default:
      return (
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='nav-icon'>
          <path d='M3 7h18v10H3z' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M12 7v10' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
        </svg>
      );
  }
};

const Sidebar = ({ activeTab, onNavigate }: SidebarProps) => {
  return (
    <aside className='sidebar'>
      <div className='sidebar-top'>
        <div className='brand'>
          <div className='brand-logo' aria-hidden>
            <svg width='36' height='36' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <circle cx='12' cy='12' r='10' fill='url(#g)' />
              <defs>
                <linearGradient id='g' x1='0' x2='1'>
                  <stop offset='0' stopColor='#ff7a43' />
                  <stop offset='1' stopColor='#ff5a2a' />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className='brand-meta'>
            <div className='back-row'>← <span className='back-text'>Gestión del local</span></div>
            <div className='brand-name'>D.CC</div>
          </div>
        </div>
      </div>

      <nav className='side-nav' aria-label='Navegación principal'>
        <div className='nav-heading'>Menú</div>
        <ul className='nav-list'>
          {dashboardTabs.map(tab => (
            <li key={tab.id} className={`nav-item ${tab.id === activeTab ? 'active' : ''}`}>
              <button
                type='button'
                onClick={() => onNavigate && onNavigate(tab.id)}
                className='nav-button'
              >
                <Icon name={tab.id === 'orders' ? 'orders' : tab.id === 'meals' ? 'tables' : 'dashboard'} />
                <span className='nav-label'>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <hr className='nav-sep' />

        <div className='nav-heading'>Otros</div>
        <ul className='nav-list small'>
          <li className='nav-item'>
            <button type='button' className='nav-button'>
              <Icon name='tables' />
              <span className='nav-label'>Ajustes</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className='profile-card'>
        <img alt='avatar' src='https://i.pravatar.cc/40?img=12' className='avatar' />
        <div className='profile-meta'>
          <div className='profile-name'>John Holland</div>
          <div className='profile-role'>Admin</div>
        </div>
        <button className='profile-actions' aria-label='Más acciones'>⋯</button>
      </div>
    </aside>
  );
};

export default Sidebar;
