import { useState } from 'react';
import GlobalSidebar from './components/GlobalSidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Meals from './pages/Meals';
import Orders from './pages/Orders';

type ModuleId = 'dashboard' | 'customers' | 'meals' | 'orders';

function App() {
  const [module, setModule] = useState<ModuleId>('dashboard');

  return (
    <div className='app-shell'>
      <GlobalSidebar activeModule={module} onNavigate={setModule} />

      <main className='main-content'>
        {module === 'dashboard' && <Dashboard />}
        {module === 'customers' && <Customers />}
        {module === 'meals' && <Meals />}
        {module === 'orders' && <Orders />}
      </main>
    </div>
  );
}

export default App;
