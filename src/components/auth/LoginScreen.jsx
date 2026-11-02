import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  User,
  ShieldCheck,
  Activity,
  Wrench,
  ArrowRight,
  Factory
} from 'lucide-react';

export default function LoginScreen() {
  const { login, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState('Admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'Admin') setUsername('admin');
    else if (role === 'Supervisor') setUsername('supervisor');
    else setUsername('operator');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please enter both username and password', 'error');
      return;
    }
    if (password !== '1234') {
      showToast('Invalid password! Demo password is 1234', 'error');
      return;
    }
    login(selectedRole, username);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 grid-mesh flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-emerald-500" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-sky-600/25 mb-3 font-display font-black text-2xl tracking-wider">
            LM
          </div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            LOOMUS 2.0
          </h1>
          <p className="text-xs font-semibold text-slate-400 font-mono tracking-widest uppercase mt-0.5">
            Textile Machine Management Suite
          </p>
        </div>

        {/* Role Switcher Selection */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold text-slate-400 font-mono tracking-wider uppercase mb-2">
            Select Access Portal
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('Admin')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'Admin'
                  ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-xs ring-2 ring-sky-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Admin</span>
              <span className="text-[9px] font-normal text-slate-400">Full Access</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('Supervisor')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'Supervisor'
                  ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs ring-2 ring-amber-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-600" />
              <span>Supervisor</span>
              <span className="text-[9px] font-normal text-slate-400">Floor Level</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('Operator')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'Operator'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs ring-2 ring-emerald-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>Operator</span>
              <span className="text-[9px] font-normal text-slate-400">HMI Console</span>
            </button>
          </div>

          <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 font-medium">
            {selectedRole === 'Admin' && (
              <span>👑 <strong>Admin Portal:</strong> Full control over entire mill, financial analytics, sales, brokers, and database reset.</span>
            )}
            {selectedRole === 'Supervisor' && (
              <span>🛡️ <strong>Supervisor Portal:</strong> Floor oversight, warp breakage alarms, shift production grading, and staff allocation.</span>
            )}
            {selectedRole === 'Operator' && (
              <span>⚡ <strong>Operator Portal:</strong> Tactile HMI touchscreen console, direct motor speed dials, and one-touch defect logger.</span>
            )}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              USERNAME / OPERATOR ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              SECURITY PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password (default: 1234)"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-sky-600/25 active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In to {selectedRole} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-mono">
            Demo Credentials: <strong>1234</strong> for all roles
          </p>
        </div>
      </div>
    </div>
  );
}

