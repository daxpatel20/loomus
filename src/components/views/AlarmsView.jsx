import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatCard from '../common/StatCard';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Plus,
  Volume2,
  Trash2,
  Filter
} from 'lucide-react';

export default function AlarmsView() {
  const {
    alarms,
    ackAlarm,
    ackAllAlarms,
    addTestAlarm,
    soundEnabled,
    setSelectedMachineId,
    showToast
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState('all');

  const criticalCount = alarms.filter(a => a.type === 'critical').length;
  const warningCount = alarms.filter(a => a.type === 'warning').length;
  const infoCount = alarms.filter(a => a.type === 'info').length;

  const filteredAlarms = alarms.filter(a => {
    if (severityFilter === 'all') return true;
    return a.type === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
              Safety Diagnostic Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900">
            Machine Fault Alarms & Warp Breakage Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time optical warp sensor trips, motor overheating, low air pressure warnings, and maintenance notices.
          </p>
        </div>

        {/* Global Alarm Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full sm:w-auto">
          <button
            onClick={ackAllAlarms}
            disabled={alarms.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acknowledge All</span>
          </button>

          <button
            onClick={addTestAlarm}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Trigger Test Fault</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="CRITICAL FAULTS"
          value={criticalCount}
          subtitle="Immediate loom stoppage"
          icon={AlertCircle}
          variant="rose"
        />

        <StatCard
          title="OPERATIONAL WARNINGS"
          value={warningCount}
          subtitle="Tension & pressure drift"
          icon={AlertTriangle}
          variant="amber"
        />

        <StatCard
          title="PREVENTATIVE INFO"
          value={infoCount}
          subtitle="Greasing & supply levels"
          icon={Info}
          variant="blue"
        />
      </div>

      {/* Filter Tabs */}
      <div className="heavy-card rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              severityFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Alerts ({alarms.length})
          </button>
          <button
            onClick={() => setSeverityFilter('critical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              severityFilter === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setSeverityFilter('warning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              severityFilter === 'warning'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Warnings ({warningCount})
          </button>
          <button
            onClick={() => setSeverityFilter('info')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              severityFilter === 'info'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            Info ({infoCount})
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400 font-semibold">
          Showing {filteredAlarms.length} incidents
        </span>
      </div>

      {/* Alarm Incidents List */}
      <div className="space-y-3">
        {filteredAlarms.map(a => {
          const isCritical = a.type === 'critical';
          const isWarning = a.type === 'warning';

          return (
            <div
              key={a.id}
              className={`heavy-card rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 ${
                isCritical
                  ? 'border-l-rose-600 bg-rose-50/40 border-rose-200'
                  : isWarning
                  ? 'border-l-amber-500 bg-amber-50/40 border-amber-200'
                  : 'border-l-sky-500 bg-sky-50/40 border-sky-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  isCritical ? 'bg-rose-100 text-rose-600' :
                  isWarning ? 'bg-amber-100 text-amber-600' :
                  'bg-sky-100 text-sky-600'
                }`}>
                  {isCritical ? <AlertCircle className="w-5 h-5" /> :
                   isWarning ? <AlertTriangle className="w-5 h-5" /> :
                   <Info className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {a.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                      Code: {a.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1">
                    <span>Timestamp: {a.time}</span>
                    <span>•</span>
                    <span>Machine: <strong className="text-slate-800">{a.machine}</strong></span>
                    <span>•</span>
                    <span>Location: {a.shed}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {a.machine !== 'FACTORY-WIDE' && a.machine !== 'Warehouse' && (
                  <button
                    onClick={() => setSelectedMachineId(a.machine)}
                    className="px-3 py-1.5 text-xs font-bold text-sky-700 bg-white hover:bg-sky-50 rounded-xl border border-sky-200 transition-colors"
                  >
                    Open Loom
                  </button>
                )}

                <button
                  onClick={() => ackAlarm(a.id)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 rounded-xl border border-slate-200 transition-all flex items-center gap-1 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Resolve
                </button>
              </div>
            </div>
          );
        })}

        {filteredAlarms.length === 0 && (
          <div className="heavy-card rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-70" />
            <h4 className="text-base font-bold text-slate-800">No Active Faults Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All 50 looms are operating within safe tension, RPM, and air pressure tolerance limits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

