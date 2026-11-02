import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LoomVisual from '../common/LoomVisual';
import {
  Sliders,
  Play,
  Square,
  Pause,
  RotateCcw,
  Wrench,
  ShieldAlert,
  Activity,
  Gauge,
  Wind,
  Thermometer,
  Layers,
  CheckCircle2,
  Cpu,
  Plus
} from 'lucide-react';

export default function ControlView() {
  const {
    machines,
    updateMachineStatus,
    emergencyStopAll,
    setIsAddMachineOpen,
    showToast
  } = useApp();

  const [selectedLoom, setSelectedLoom] = useState('all');
  const [rpm, setRpm] = useState(850);
  const [tension, setTension] = useState(65);
  const [pressure, setPressure] = useState(4.2);
  const [fabricType, setFabricType] = useState('70*72 Plain Cambric');
  const [weavePattern, setWeavePattern] = useState('Plain 1/1');
  const [widthCm, setWidthCm] = useState(150);
  const [picksCm, setPicksCm] = useState(32);

  const activeMachine = machines.find(m => m.id === selectedLoom) || machines[0];

  const handleAction = (action) => {
    if (machines.length === 0) {
      showToast('Please add a loom machine first!', 'warning');
      return;
    }
    if (action === 'emergency') {
      emergencyStopAll();
      return;
    }
    const statusMap = {
      start: 'running',
      stop: 'stopped',
      pause: 'idle',
      reset: 'idle',
      maintenance: 'maintenance'
    };
    updateMachineStatus(selectedLoom, statusMap[action] || 'idle');
  };

  const handleApplyFabric = (e) => {
    e.preventDefault();
    if (machines.length === 0) {
      showToast('Please add a loom machine first!', 'warning');
      return;
    }
    showToast(`Fabric parameters applied to ${selectedLoom === 'all' ? 'All Machines' : selectedLoom}: ${fabricType} (${weavePattern})`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
              Central Automation HMI
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900">
            Machine Control & Technical Presets
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronize weaving speed, pneumatic air-jet timing, warp beam tension, and fabric density.
          </p>
        </div>

        {/* Machine Target Selector */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-full sm:w-auto justify-between sm:justify-start">
          <label className="text-xs font-bold text-slate-500 font-mono pl-1 sm:pl-2 shrink-0">TARGET:</label>
          <select
            value={selectedLoom}
            onChange={e => setSelectedLoom(e.target.value)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white text-slate-900 font-mono font-bold text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">⚡ ALL {machines.length} MACHINES (GLOBAL)</option>
            {machines.map(m => (
              <option key={m.id} value={m.id}>
                {m.id} ({m.fabric}) — {m.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {machines.length === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
          <span className="text-xs font-semibold">
            Floor par koi loom nahi hai. Controls activate karne ke liye pehle loom add karein.
          </span>
          <button
            onClick={() => setIsAddMachineOpen(true)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Loom Machine
          </button>
        </div>
      )}

      {/* Primary Push Button Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => handleAction('start')}
          className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START MACHINE</span>
        </button>

        <button
          onClick={() => handleAction('stop')}
          className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20 active:scale-95"
        >
          <Square className="w-5 h-5 fill-current" />
          <span>STOP MACHINE</span>
        </button>

        <button
          onClick={() => handleAction('pause')}
          className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Pause className="w-5 h-5 fill-current" />
          <span>PAUSE / IDLE</span>
        </button>

        <button
          onClick={() => handleAction('reset')}
          className="p-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>RESET FAULTS</span>
        </button>

        <button
          onClick={() => handleAction('maintenance')}
          className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Wrench className="w-5 h-5" />
          <span>MAINTENANCE</span>
        </button>

        <button
          onClick={() => handleAction('emergency')}
          className="p-4 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-rose-900/30 active:scale-95 animate-pulse"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>EMERGENCY</span>
        </button>
      </div>

      {/* Two Column Grid: Speed & Tension Sliders + Fabric Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Telemetry Tuning */}
        <div className="heavy-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              Speed & Tension Parameters
            </h3>
            <span className="text-xs font-mono text-slate-400 font-bold">
              Target: {selectedLoom === 'all' ? `All ${machines.length} Looms` : selectedLoom}
            </span>
          </div>

          {/* RPM Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>🔄 Weaving Speed (RPM)</span>
              <span className="font-mono font-bold text-sky-600 text-sm">{rpm} RPM</span>
            </div>
            <input
              type="range"
              min="200"
              max="1200"
              value={rpm}
              onChange={e => setRpm(e.target.value)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>200 RPM</span>
              <span>1200 RPM</span>
            </div>
          </div>

          {/* Warp Tension Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>🧵 Warp Yarn Beam Tension (%)</span>
              <span className="font-mono font-bold text-indigo-600 text-sm">{tension}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={tension}
              onChange={e => setTension(e.target.value)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Air Pressure */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>💨 Pneumatic Air-Jet Nozzle (bar)</span>
              <span className="font-mono font-bold text-teal-600 text-sm">{pressure} bar</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="7.0"
              step="0.1"
              value={pressure}
              onChange={e => setPressure(e.target.value)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          <button
            onClick={() => showToast(`Tension & Speed parameters synced to ${selectedLoom}`, 'success')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Synchronize Parameters
          </button>
        </div>

        {/* Fabric Presets Form */}
        <form onSubmit={handleApplyFabric} className="heavy-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Fabric Variety & Weave Preset
            </h3>
            <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Technical Presets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">FABRIC VARIETY</label>
              <select
                value={fabricType}
                onChange={e => setFabricType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
              >
                <option>70*72 Plain Cambric</option>
                <option>70*68 Medium Grey</option>
                <option>60 Gram Waterjet</option>
                <option>Cotton 40s Combed</option>
                <option>Cotton 60s Compact</option>
                <option>Heavy Denim 14oz</option>
                <option>Silk Blend Chiffon</option>
                <option>Rayon 30s Twill</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">WEAVE PATTERN</label>
              <select
                value={weavePattern}
                onChange={e => setWeavePattern(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
              >
                <option>Plain 1/1</option>
                <option>Twill 2/1</option>
                <option>Twill 3/1 (Denim)</option>
                <option>Satin / Sateen 4/1</option>
                <option>Jacquard Floral</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">REED WIDTH (CM)</label>
              <input
                type="number"
                value={widthCm}
                onChange={e => setWidthCm(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">DENSITY (PICKS/CM)</label>
              <input
                type="number"
                value={picksCm}
                onChange={e => setPicksCm(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Apply Fabric Preset to Machine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
