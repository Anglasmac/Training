import { useState } from 'react';
import GlobalSidebar from './components/GlobalSidebar';
import Customers from './pages/Customers';
import Meals from './pages/Meals';
import Orders from './pages/Orders';

type ModuleId = 'customers' | 'meals' | 'orders';

function App() {
  const [module, setModule] = useState<ModuleId>('customers');

  return (
    <div className='app-shell'>
      <GlobalSidebar activeModule={module} onNavigate={setModule} />

      <main className='main-content'>
        {module === 'customers' && <Customers />}
        {module === 'meals' && <Meals />}
        {module === 'orders' && <Orders />}
      </main>
    </div>
  );
}

export default App;
