import { useState } from 'react';
import { DashboardScreen, type TabId } from '../modules/Dashboard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>('customers');

  return <DashboardScreen activeTab={activeTab} onTabChange={setActiveTab} />;
};

export default Dashboard;
