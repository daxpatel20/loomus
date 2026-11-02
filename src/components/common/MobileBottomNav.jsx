import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Cpu,
  Sliders,
  Activity,
  Wrench,
  Boxes,
  AlertTriangle,
  Menu
} from 'lucide-react';

export default function MobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    userRole,
    alarms,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const criticalAlarmsCount = alarms.filter(a => a.type === 'critical').length;

  // Role-Specific Mobile Bottom Navigation Configuration
  const adminNav = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'machines', label: 'Looms', icon: Cpu },
    { id: 'control', label: 'Control', icon: Sliders },
    { id: 'alarms', label: 'Alarms', icon: AlertTriangle, hasBadge: true },
  ];

  const supervisorNav = [
    { id: 'supervisor-floor', label: 'Floor', icon: Activity },
    { id: 'machines', label: 'Looms', icon: Cpu },
    { id: 'production', label: 'Quality', icon: Boxes },
    { id: 'alarms', label: 'Alarms', icon: AlertTriangle, hasBadge: true },
  ];

  const operatorNav = [
    { id: 'operator-console', label: 'HMI', icon: Wrench },
    { id: 'machines', label: 'Looms', icon: Cpu },
    { id: 'production', label: 'Log Cut', icon: Boxes },
    { id: 'alarms', label: 'Alerts', icon: AlertTriangle, hasBadge: true },
  ];

  const currentItems = userRole === 'Operator' ? operatorNav : userRole === 'Supervisor' ? supervisorNav : adminNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg flex items-center justify-around select-none">
      {currentItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-sky-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.hasBadge && alarms.length > 0 && (
                <span className={`absolute -top-1 -right-2 px-1 text-[9px] font-bold rounded-full text-white ${criticalAlarmsCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'}`}>
                  {alarms.length}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* 5. Mobile Menu (Drawer Toggle) */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          isMobileMenuOpen
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Menu</span>
      </button>
    </nav>
  );
}

