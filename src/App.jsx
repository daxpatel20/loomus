import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import MobileBottomNav from './components/common/MobileBottomNav';
import MachineModal from './components/common/MachineModal';
import AddMachineModal from './components/common/AddMachineModal';
import DataManagerModal from './components/common/DataManagerModal';
import WhatsAppConfigModal from './components/common/WhatsAppConfigModal';
import WhatsAppShareModal from './components/common/WhatsAppShareModal';
import Toast from './components/common/Toast';
import LoginScreen from './components/auth/LoginScreen';

// Views
import DashboardView from './components/views/DashboardView';
import SupervisorFloor from './components/supervisor/SupervisorFloor';
import OperatorConsole from './components/operator/OperatorConsole';
import MachinesView from './components/views/MachinesView';
import ControlView from './components/views/ControlView';
import ProductionView from './components/views/ProductionView';
import CameraView from './components/views/CameraView';
import AlarmsView from './components/views/AlarmsView';
import WorkersView from './components/views/WorkersView';
import RawMaterialView from './components/views/RawMaterialView';
import SalesView from './components/views/SalesView';
import AnalyticsView from './components/views/AnalyticsView';

// Role-Based Access Control (RBAC) Tab Whitelists
const ROLE_ALLOWED_TABS = {
  Admin: ['dashboard', 'machines', 'control', 'production', 'camera', 'alarms', 'workers', 'rawmaterial', 'sales', 'analytics'],
  Supervisor: ['supervisor-floor', 'machines', 'production', 'alarms', 'workers', 'camera', 'rawmaterial'],
  Operator: ['operator-console', 'machines', 'production', 'alarms']
};

const ROLE_DEFAULT_TAB = {
  Admin: 'dashboard',
  Supervisor: 'supervisor-floor',
  Operator: 'operator-console'
};

export default function App() {
  const { isAuthenticated, activeTab, setActiveTab, userRole } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const allowedTabs = ROLE_ALLOWED_TABS[userRole] || ROLE_ALLOWED_TABS.Operator;
  const isTabAllowed = allowedTabs.includes(activeTab);

  // Auto-redirect if tab is not permitted for the user's role
  React.useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(ROLE_DEFAULT_TAB[userRole] || 'operator-console');
    }
  }, [activeTab, userRole, allowedTabs, setActiveTab]);

  const renderActiveView = () => {
    const currentTab = isTabAllowed ? activeTab : (ROLE_DEFAULT_TAB[userRole] || 'operator-console');

    switch (currentTab) {
      case 'dashboard':
        return userRole === 'Admin' ? <DashboardView /> : <SupervisorFloor />;
      case 'supervisor-floor':
        return (userRole === 'Admin' || userRole === 'Supervisor') ? <SupervisorFloor /> : <OperatorConsole />;
      case 'operator-console':
        return <OperatorConsole />;
      case 'machines':
        return <MachinesView />;
      case 'control':
        return userRole === 'Admin' ? <ControlView /> : <SupervisorFloor />;
      case 'production':
        return <ProductionView />;
      case 'camera':
        return (userRole === 'Admin' || userRole === 'Supervisor') ? <CameraView /> : <OperatorConsole />;
      case 'alarms':
        return <AlarmsView />;
      case 'workers':
        return (userRole === 'Admin' || userRole === 'Supervisor') ? <WorkersView /> : <OperatorConsole />;
      case 'rawmaterial':
        return (userRole === 'Admin' || userRole === 'Supervisor') ? <RawMaterialView /> : <OperatorConsole />;
      case 'sales':
        return userRole === 'Admin' ? <SalesView /> : <SupervisorFloor />;
      case 'analytics':
        return userRole === 'Admin' ? <AnalyticsView /> : <SupervisorFloor />;
      default:
        return userRole === 'Admin' ? <DashboardView /> : userRole === 'Supervisor' ? <SupervisorFloor /> : <OperatorConsole />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Precision Top Navigation Bar */}
      <Header />

      {/* Main Workspace: Sidebar + View Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 pb-24 md:pb-8 bg-slate-50/60 grid-mesh">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Interactive Machine Diagnostic Telemetry Modal */}
      <MachineModal />

      {/* Add New Machine Modal: Restricted to Admin and Supervisor */}
      {(userRole === 'Admin' || userRole === 'Supervisor') && <AddMachineModal />}

      {/* Factory Data Manager & Reset Modal: STRICTLY ADMIN ONLY */}
      {userRole === 'Admin' && <DataManagerModal />}

      {/* Admin WhatsApp Alert Config Modal */}
      <WhatsAppConfigModal />

      {/* Interactive WhatsApp Recipient & Share Modal */}
      <WhatsAppShareModal />

      {/* Mobile Bottom Navigation Bar (Visible only on phones & small screens) */}
      <MobileBottomNav />

      {/* Floating System Notification Toast */}
      <Toast />
    </div>
  );
}
