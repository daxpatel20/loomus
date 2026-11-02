import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Database,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Users,
  Layers,
  Camera,
  Briefcase
} from 'lucide-react';

export default function DataManagerModal() {
  const {
    isDataManagerOpen,
    setIsDataManagerOpen,
    machines,
    workers,
    alarms,
    stockLevels,
    readyGoods,
    brokers,
    salesOrders,
    cameras,
    productionLogs,
    clearAllData,
    loadDemoData,
    exportDataJSON,
    importDataJSON,
    showToast
  } = useApp();

  const fileInputRef = useRef(null);

  if (!isDataManagerOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importDataJSON(content);
        setIsDataManagerOpen(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-display">
                Factory Data & Database Center
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono">
                Clean slate reset, demo loader, and JSON backups
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDataManagerOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {/* Current Factory Records Count */}
          <div className="heavy-card rounded-2xl p-4 bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
              Current Factory Records in Browser Storage
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">MACHINES</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">{machines.length}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">STAFF</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">{workers.length}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">YARN TYPES</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">{stockLevels.length}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">READY ROLLS</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">{readyGoods.length}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">BROKERS</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">{brokers.length}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">CAMERAS</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">{cameras.length}</span>
              </div>
            </div>
          </div>

          {/* Primary Action: Clear All Data */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Pura Data Delete Karein (Fresh 0 Start)</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              Yeh button click karne se sabhi machines, workers, inventory aur orders permanently delete ho jayenge aur aap shuru se apna naya data add kar sakenge.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Kya aap sachme pura data delete karke 0 se fresh start karna chahte hain?')) {
                  clearAllData();
                  setIsDataManagerOpen(false);
                }
              }}
              className="mt-2 w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              WIPE / DELETE ALL DATA (START AT 0)
            </button>
          </div>

          {/* Secondary Actions: Load Demo Data & Backups */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Alternative Actions & Backups
            </h4>

            {/* Load Demo Data Button */}
            <button
              onClick={() => {
                loadDemoData();
                setIsDataManagerOpen(false);
              }}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-sky-600" />
                <span>Load Sample Demo Data (50 Reference Looms)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Optional</span>
            </button>

            {/* Export JSON */}
            <button
              onClick={exportDataJSON}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Download Factory Backup File (JSON)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Save Offline</span>
            </button>

            {/* Import JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Restore / Import Factory Backup (JSON)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Upload</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

