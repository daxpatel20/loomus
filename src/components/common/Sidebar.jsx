import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Cpu,
  Sliders,
  Boxes,
  Camera,
  AlertTriangle,
  Users,
  Layers,
  Briefcase,
  TrendingUp,
  Activity,
  Wrench,
  Zap,
  Gauge,
  X,
  SlidersHorizontal,
  Plus,
  Database
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    userRole,
    currentUser,
    logout,
    machines,
    alarms,
    powerLoadPercent,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsAddMachineOpen,
    setIsDataManagerOpen
  } = useApp();

  const runningCount = machines.filter(m => m.status === 'running').length;
  const stoppedCount = machines.filter(m => m.status === 'stopped').length;
  const idleCount = machines.filter(m => m.status === 'idle' || m.status === 'maintenance').length;

  // Role-tailored navigation items
  const adminNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'machines', label: 'Loom Factory Floor', icon: Cpu, badge: `${runningCount}/${machines.length}` },
    { id: 'control', label: 'Central Machine HMI', icon: Sliders },
    { id: 'production', label: 'Production & Quality', icon: Boxes },
    { id: 'camera', label: 'EasyViewer CCTV Hub', icon: Camera },
    { id: 'alarms', label: 'Safety & Alarm Center', icon: AlertTriangle, badge: alarms.length > 0 ? alarms.length : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'workers', label: 'Workers & Shifts', icon: Users },
    { id: 'rawmaterial', label: 'Raw Yarn Inventory', icon: Layers },
    { id: 'sales', label: 'Sales, Brokers & Stock', icon: Briefcase },
    { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
  ];

  const supervisorNav = [
    { id: 'supervisor-floor', label: 'Supervisor Floor Oversight', icon: Activity },
    { id: 'machines', label: 'Loom Fleet Status', icon: Cpu, badge: `${runningCount}/${machines.length}` },
    { id: 'production', label: 'Shift Production & Grading', icon: Boxes },
    { id: 'alarms', label: 'Live Breakages & Alarms', icon: AlertTriangle, badge: alarms.length > 0 ? alarms.length : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'workers', label: 'Worker Floor Roster', icon: Users },
    { id: 'camera', label: 'Loom Area Cameras', icon: Camera },
    { id: 'rawmaterial', label: 'Yarn Creel Status', icon: Layers },
  ];

  const operatorNav = [
    { id: 'operator-console', label: 'Industrial Loom Console', icon: Wrench },
    { id: 'machines', label: 'Assigned Looms Bay', icon: Cpu },
    { id: 'control', label: 'Direct Speed & Tension', icon: Sliders },
    { id: 'production', label: 'Log Fabric Cut / Roll', icon: Boxes },
    { id: 'alarms', label: 'Loom Alerts & Stops', icon: AlertTriangle, badge: alarms.length > 0 ? alarms.length : null, badgeColor: 'bg-rose-500 text-white' },
  ];

  let currentNav = adminNav;
  if (userRole === 'Supervisor') currentNav = supervisorNav;
  else if (userRole === 'Operator') currentNav = operatorNav;

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto pb-12 md:pb-4">
      {/* Nav Menu Links */}
      <nav className="px-3 py-3 space-y-1">
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700')
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action Buttons for Mobile / Desktop (Restricted by Role) */}
      {(userRole === 'Admin' || userRole === 'Supervisor') && (
        <div className="px-3 py-2 space-y-2">
          <button
            onClick={() => {
              setIsAddMachineOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Loom</span>
          </button>

          {userRole === 'Admin' && (
            <button
              onClick={() => {
                setIsDataManagerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>Reset / Manage Data</span>
            </button>
          )}
        </div>
      )}

      {/* Live Plant Telemetry Summary Box in Bottom */}
      <div className="p-3.5 m-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-sky-600" />
            <span>LOOM FLEET</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{machines.length} Total</span>
        </div>

        {/* 3 mini status badges */}
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="p-1 rounded-lg bg-emerald-50 border border-emerald-200/80">
            <div className="text-[9px] font-semibold text-emerald-700">RUN</div>
            <div className="text-xs font-extrabold text-emerald-800 font-mono">{runningCount}</div>
          </div>
          <div className="p-1 rounded-lg bg-rose-50 border border-rose-200/80">
            <div className="text-[9px] font-semibold text-rose-700">STOP</div>
            <div className="text-xs font-extrabold text-rose-800 font-mono">{stoppedCount}</div>
          </div>
          <div className="p-1 rounded-lg bg-amber-50 border border-amber-200/80">
            <div className="text-[9px] font-semibold text-amber-700">IDLE</div>
            <div className="text-xs font-extrabold text-amber-800 font-mono">{idleCount}</div>
          </div>
        </div>

        {/* Power Load Gauge */}
        <div className="pt-0.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3 text-amber-500" /> Plant Power
            </span>
            <span className="font-mono font-bold text-slate-800">{powerLoadPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500 transition-all duration-700 rounded-full"
              style={{ width: `${powerLoadPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── DESKTOP SIDEBAR (Visible on md: and above) ─── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/90 flex-col shrink-0 min-h-[calc(100vh-61px)] select-none">
        {/* Role Banner Indicator */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-slate-500">
              Active Mode
            </span>
            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md font-mono ${
              userRole === 'Admin' ? 'bg-sky-100 text-sky-800' :
              userRole === 'Supervisor' ? 'bg-amber-100 text-amber-800' :
              'bg-emerald-100 text-emerald-800'
            }`}>
              {userRole.toUpperCase()}
            </span>
          </div>
        </div>

        {navContent}
      </aside>

      {/* ─── MOBILE SLIDE-OVER DRAWER (Visible when isMobileMenuOpen is true) ─── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  LM
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900">LOOMUS 2.0</span>
                  <span className="text-[10px] font-mono block text-slate-400">Navigation Menu</span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authenticated User Session Card inside Drawer (Non-switchable) */}
            <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {currentUser.avatar}
                </div>
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                    {currentUser.displayName}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                    userRole === 'Admin' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                    userRole === 'Supervisor' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {userRole.toUpperCase()} PORTAL
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors"
                title="Logout Session"
              >
                Logout
              </button>
            </div>

            {/* Nav content */}
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
