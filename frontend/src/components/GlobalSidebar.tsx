type ModuleId = 'customers' | 'meals' | 'orders';

interface GlobalSidebarProps {
  activeModule: ModuleId;
  onNavigate: (module: ModuleId) => void;
}

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case 'customers':
      return (
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='nav-icon'
        >
          <path
            d='M8 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
            stroke='currentColor'
            strokeWidth='1.4'
          />
          <path
            d='M14 20a6 6 0 0 0-12 0'
            stroke='currentColor'
            strokeWidth='1.4'
          />
          <path
            d='M20 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
            stroke='currentColor'
            strokeWidth='1.4'
          />
          <path
            d='M20 20a6 6 0 0 0-12 0'
            stroke='currentColor'
            strokeWidth='1.4'
          />
        </svg>
      );
    case 'meals':
      return (
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='nav-icon'
        >
          <path
            d='M3 7h18v10H3z'
            stroke='currentColor'
            strokeWidth='1.4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12 7v10'
            stroke='currentColor'
            strokeWidth='1.4'
            strokeLinecap='round'
          />
        </svg>
      );
    case 'orders':
    default:
      return (
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='nav-icon'
        >
          <path
            d='M3 7h18'
            stroke='currentColor'
            strokeWidth='1.4'
            strokeLinecap='round'
          />
          <path
            d='M7 11h10'
            stroke='currentColor'
            strokeWidth='1.4'
            strokeLinecap='round'
          />
          <path
            d='M9 15h6'
            stroke='currentColor'
            strokeWidth='1.4'
            strokeLinecap='round'
          />
        </svg>
      );
  }
};

const modules: Array<{ id: ModuleId; label: string; description: string }> = [
  { id: 'customers', label: 'Clientes', description: 'Gestión de clientes' },
  { id: 'meals', label: 'Combos', description: 'Gestión de menú' },
  { id: 'orders', label: 'Pedidos', description: 'Gestión de pedidos' },
];

const GlobalSidebar = ({ activeModule, onNavigate }: GlobalSidebarProps) => {
  return (
    <aside className='sidebar'>
      <div className='sidebar-top'>
        <div className='brand'>
          <div className='brand-logo' aria-hidden>
            <svg
              width='36'
              height='36'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
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
            <div className='back-row'>
              ← <span className='back-text'>Gestión del local</span>
            </div>
            <div className='brand-name'>D.CC</div>
          </div>
        </div>
      </div>

      <nav className='side-nav' aria-label='Módulos'>
        <div className='nav-heading'>Menú</div>
        <ul className='nav-list'>
          {modules.map(mod => (
            <li
              key={mod.id}
              className={`nav-item ${mod.id === activeModule ? 'active' : ''}`}
            >
              <button
                type='button'
                onClick={() => onNavigate(mod.id)}
                className='nav-button'
                title={mod.description}
              >
                <Icon name={mod.id} />
                <span className='nav-label'>{mod.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <hr className='nav-sep' />
      </nav>
    </aside>
  );
};

export default GlobalSidebar;
