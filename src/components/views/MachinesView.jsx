import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LoomVisual from '../common/LoomVisual';
import {
  Play,
  Square,
  ShieldAlert,
  Search,
  Filter,
  Cpu,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';

export default function MachinesView() {
  const {
    machines,
    userRole,
    setSelectedMachineId,
    startAllMachines,
    stopAllMachines,
    emergencyStopAll,
    deleteMachine,
    setIsAddMachineOpen,
    loadDemoData
  } = useApp();

  const [shedFilter, setShedFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('id'); // 'id' | 'output' | 'rpm' | 'efficiency'

  const filteredMachines = machines
    .filter(m => {
      const matchShed = shedFilter === 'all' || m.shed.toLowerCase().includes(shedFilter.toLowerCase());
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchSearch = m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.model.toLowerCase().includes(searchQuery.toLowerCase());
      return matchShed && matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'output') return b.output - a.output;
      if (sortBy === 'rpm') return b.rpm - a.rpm;
      if (sortBy === 'efficiency') return b.efficiency - a.efficiency;
      return a.id.localeCompare(b.id);
    });

  const runningCount = machines.filter(m => m.status === 'running').length;
  const stoppedCount = machines.filter(m => m.status === 'stopped').length;
  const idleCount = machines.filter(m => m.status === 'idle' || m.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Top Action & Summary Bar */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
              {machines.length} Loom Production Floor
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900">
            Loom Fleet Monitoring & Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure, manage, and monitor your weaving looms with real-time status and telemetry.
          </p>
        </div>

        {/* Global Batch Controls & Add Loom Button (Restricted by Role) */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {(userRole === 'Admin' || userRole === 'Supervisor') && (
            <button
              onClick={() => setIsAddMachineOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW LOOM</span>
            </button>
          )}

          {machines.length > 0 && (
            <>
              {(userRole === 'Admin' || userRole === 'Supervisor') && (
                <>
                  <button
                    onClick={startAllMachines}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start All</span>
                  </button>

                  <button
                    onClick={stopAllMachines}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop All</span>
                  </button>
                </>
              )}

              <button
                onClick={emergencyStopAll}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/30 active:scale-95 animate-pulse"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>E-STOP</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar (Only shown when machines exist) */}
      {machines.length > 0 && (
        <div className="heavy-card rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Status Filters */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Looms ({machines.length})
            </button>
            <button
              onClick={() => setStatusFilter('running')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'running'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Running ({runningCount})
            </button>
            <button
              onClick={() => setStatusFilter('stopped')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'stopped'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Stopped ({stoppedCount})
            </button>
            <button
              onClick={() => setStatusFilter('idle')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'idle'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Idle / Maint ({idleCount})
            </button>
          </div>

          {/* Shed & Sort Controls */}
          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end flex-wrap">
            {/* Shed Filter Dropdown */}
            <select
              value={shedFilter}
              onChange={e => setShedFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Sheds</option>
              <option value="Shed A">Shed A</option>
              <option value="Shed B">Shed B</option>
            </select>

            {/* Sort By Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="id">Sort by ID</option>
              <option value="output">Highest Output</option>
              <option value="rpm">Highest RPM</option>
              <option value="efficiency">Highest Efficiency</option>
            </select>

            {/* Search Box */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ID, fabric..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid of Loom Cards or Empty State */}
      {machines.length === 0 ? (
        <div className="heavy-card rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-sm">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              No Loom Machines Added Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              Aapka factory floor abhi clean hai! Aap apna pehla loom machine add karke ID, shed, model aur fabric set kar sakte hain.
            </p>
          </div>

          {userRole === 'Operator' ? (
            <p className="text-xs text-slate-500 font-medium">
              Please contact your Shift Supervisor or Mill Admin to assign loom machines to your station.
            </p>
          ) : (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsAddMachineOpen(true)}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add First Loom Machine
              </button>

              {userRole === 'Admin' && (
                <button
                  onClick={loadDemoData}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Load Sample 50 Looms
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMachines.map(m => {
            const isRunning = m.status === 'running';
            const isStopped = m.status === 'stopped';

            return (
              <div
                key={m.id}
                className={`heavy-card rounded-2xl p-4 transition-all hover:-translate-y-1 relative group ${
                  isStopped ? 'border-rose-300 ring-2 ring-rose-100' : 'hover:border-sky-300'
                }`}
              >
                {/* Delete Machine Button (STRICTLY ADMIN ONLY) */}
                {userRole === 'Admin' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Kya aap Loom ${m.id} ko delete karna chahte hain?`)) {
                        deleteMachine(m.id);
                      }
                    }}
                    title="Delete Machine (Admin Only)"
                    className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all z-10 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Card Clickable Container */}
                <div onClick={() => setSelectedMachineId(m.id)} className="cursor-pointer">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {m.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isRunning ? 'bg-emerald-100 text-emerald-800' :
                      isStopped ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {m.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Loom Visual Animation */}
                  <div className="my-2">
                    <LoomVisual status={m.status} rpm={m.rpm} compact={true} />
                  </div>

                  {/* Card Meta */}
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-800 truncate" title={m.fabric}>
                      {m.fabric}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Speed:</span>
                      <span className="font-bold text-slate-900">{isRunning ? `${m.rpm} RPM` : '0 RPM'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Output:</span>
                      <span className="font-bold text-emerald-700">{m.output}m</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                      <span>{m.shed.split(' ')[0]}</span>
                      <span className="text-sky-600 font-semibold hover:underline">Telemetry →</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
