import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Volume2,
  VolumeX,
  ShieldAlert,
  Power,
  Clock,
  SlidersHorizontal,
  Wrench,
  Activity,
  Database,
  Plus,
  Menu,
  ChevronDown,
  MessageSquare
} from 'lucide-react';

export default function Header() {
  const {
    currentUser,
    userRole,
    switchRole,
    alarms,
    machines,
    setActiveTab,
    soundEnabled,
    setSoundEnabled,
    logout,
    emergencyStopAll,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsDataManagerOpen,
    setIsAddMachineOpen,
    setIsWhatsAppModalOpen,
    adminWhatsAppPhone
  } = useApp();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalAlarmsCount = alarms.filter(a => a.type === 'critical').length;
  const runningCount = machines.filter(m => m.status === 'running').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Mobile Hamburger + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 font-bold font-display text-lg sm:text-xl tracking-wider shrink-0">
              LM
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold tracking-tight text-base sm:text-xl font-display text-slate-900">
                  LOOMUS
                </span>
                <span className="hidden min-[400px]:inline-block bg-sky-100 text-sky-800 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.2 rounded-full border border-sky-200">
                  v2.0
                </span>
              </div>
              <p className="hidden sm:block text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wider uppercase font-mono">
                Smart Textile Weaving Suite
              </p>
            </div>
          </div>

          <div className="hidden lg:block h-6 w-px bg-slate-200 mx-2" />

          {/* Plant Live Operational Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {machines.length > 0 ? `${runningCount}/${machines.length} LOOMS ACTIVE` : 'READY TO CONFIGURE LOOMS'}
            </span>
          </div>
        </div>

        {/* Center: Prestigious Role Indicator (Non-switchable by operators/supervisors) */}
        {userRole === 'Admin' ? (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-bold font-mono">ADMIN EXECUTIVE PORTAL</span>
            <span className="text-[10px] font-mono font-bold bg-sky-950 text-sky-300 px-1.5 py-0.2 rounded border border-sky-800">
              FULL MASTER
            </span>
          </div>
        ) : userRole === 'Supervisor' ? (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 rounded-xl border border-amber-300 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold font-mono">SUPERVISOR FLOOR CONSOLE</span>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
              SHIFT OVERSIGHT
            </span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300 shadow-xs">
            <Wrench className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold font-mono">OPERATOR HMI TERMINAL</span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
              LOOM CONSOLE
            </span>
          </div>
        )}

        {/* Mobile Role Lock Badge (Visible only on mobile) */}
        <div className="md:hidden flex items-center">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold flex items-center gap-1 border shadow-2xs ${
              userRole === 'Admin' ? 'bg-sky-50 text-sky-800 border-sky-300' :
              userRole === 'Supervisor' ? 'bg-amber-50 text-amber-800 border-amber-300' :
              'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            <span>{userRole.toUpperCase()}</span>
          </span>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Add Loom Button: Only Admin & Supervisor */}
          {(userRole === 'Admin' || userRole === 'Supervisor') && (
            <button
              onClick={() => setIsAddMachineOpen(true)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300 rounded-xl font-bold text-xs transition-all shadow-2xs"
              title="Add New Loom Machine to Mill"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Loom</span>
            </button>
          )}

          {/* Database / Data Management & Purge Button: STRICTLY ADMIN ONLY */}
          {userRole === 'Admin' && (
            <button
              onClick={() => setIsDataManagerOpen(true)}
              className="hidden min-[400px]:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all"
              title="Manage Factory Database (Wipe / Reset Data or Load Demo)"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden xl:inline">Data Reset</span>
            </button>
          )}

          {/* WhatsApp Direct Reporting Configuration */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl font-bold text-xs transition-all shadow-2xs"
            title={`Configure WhatsApp Alerts & Reports (Admin: ${adminWhatsAppPhone})`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="hidden md:inline text-[10px] font-mono font-bold bg-emerald-200/80 px-1.5 py-0.2 rounded text-emerald-900">
              {adminWhatsAppPhone?.replace('+91', '').trim().slice(-10) || '7567574107'}
            </span>
          </button>

          {/* Clock Widget (Desktop only) */}
          <div className="hidden xl:flex flex-col items-end px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-800 font-mono font-bold text-xs tracking-wide">
              <Clock className="w-3 h-3 text-sky-600" />
              <span>{timeStr || '--:--:--'}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">{dateStr}</span>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Industrial Sound FX' : 'Enable Industrial Sound FX'}
            className="hidden min-[360px]:flex p-1.5 sm:p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Emergency Stop Fast Button */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-2 py-1.5 sm:px-3 sm:py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-1"
            title="Plant-Wide Emergency Stop"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="hidden sm:inline">E-STOP</span>
          </button>

          {/* Alarm Bell with Counter (Hidden on mobile phones as MobileBottomNav has it) */}
          <button
            onClick={() => setActiveTab('alarms')}
            className="hidden md:flex relative p-1.5 sm:p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Active Alarms"
          >
            <Bell className="w-4 h-4" />
            {alarms.length > 0 && (
              <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold text-white ${criticalAlarmsCount > 0 ? 'bg-rose-600 animate-bounce' : 'bg-amber-500'}`}>
                {alarms.length}
              </span>
            )}
          </button>

          {/* User Profile Info & Logout */}
          <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-slate-200">
            <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs">
              {currentUser.avatar}
            </div>

            <button
              onClick={logout}
              title="Logout Session"
              className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Confirmation Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 border-2 border-rose-300 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-3 bg-rose-100 rounded-xl">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                  ACTIVATE EMERGENCY STOP?
                </h3>
                <p className="text-[11px] text-rose-600 font-semibold font-mono">
                  ALL LOOMS WILL HALT IMMEDIATELY
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 my-3 leading-relaxed">
              This will trigger a plant-wide safety shutdown. All warp beams and air-jet nozzles will stop instantaneously.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  emergencyStopAll();
                  setShowEmergencyModal(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/30 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                EXECUTE E-STOP
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
