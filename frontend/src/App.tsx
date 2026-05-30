import { useState } from 'react';
import GlobalSidebar from './components/GlobalSidebar';
import Customers from './pages/Customers';
import Meals from './pages/Meals';
import Orders from './pages/Orders';

type ModuleId = 'customers' | 'meals' | 'orders';

function App() {
  const [module, setModule] = useState<ModuleId>(() => {
    try {
      const stored = localStorage.getItem('activeModule') as ModuleId | null;
      return stored ?? 'customers';
    } catch {
      return 'customers';
    }
  });

  const navigate = (m: ModuleId) => {
    try {
      localStorage.setItem('activeModule', m);
    } catch {
      /* ignore */
    }
    setModule(m);
  };

  return (
    <div className='app-shell'>
      <GlobalSidebar activeModule={module} onNavigate={navigate} />

      <main className='main-content'>
        {module === 'customers' && <Customers />}
        {module === 'meals' && <Meals />}
        {module === 'orders' && <Orders />}
      </main>
    </div>
  );
}

export default App;
