import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatCard from '../common/StatCard';
import {
  openWhatsApp,
  buildWorkerDutySlipMessage,
  buildAttendanceSummaryMessage
} from '../../utils/whatsapp';
import {
  Users,
  UserCheck,
  Coffee,
  UserX,
  Plus,
  Phone,
  MessageSquare,
  Search,
  CheckCircle2,
  Cpu,
  Trash2
} from 'lucide-react';

export default function WorkersView() {
  const {
    workers,
    userRole,
    addWorker,
    deleteWorker,
    updateWorkerStatus,
    machines,
    adminWhatsAppPhone,
    openWhatsAppShare,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [role, setRole] = useState('Loom Operator');
  const [machine, setMachine] = useState(machines[0]?.id || 'M-01');
  const [shift, setShift] = useState('Morning (6AM - 2PM)');
  const [phone, setPhone] = useState('');
  const [shed, setShed] = useState('Shed A');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCount = workers.filter(w => w.status === 'active').length;
  const breakCount = workers.filter(w => w.status === 'break').length;
  const absentCount = workers.filter(w => w.status === 'absent').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !workerId.trim()) {
      showToast('Please enter worker name and ID', 'error');
      return;
    }

    addWorker({
      id: workerId.trim().toUpperCase(),
      name: name.trim(),
      role,
      machine,
      shift,
      phone: phone || '+91 98000 00000',
      status: 'active',
      shed
    });

    setName('');
    setWorkerId('');
    setPhone('');
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.machine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
              Shift Roster & Loom Assignments
            </span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Factory Floor Workers & Operators
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage loom masters, mechanics, inspectors, and attendance across industrial weaving shifts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const msg = buildAttendanceSummaryMessage(workers);
              openWhatsAppShare({
                title: 'Shift Staff Attendance Roster',
                message: msg,
                category: 'worker',
                defaultPhone: adminWhatsAppPhone
              });
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Attendance Report</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>{workers.length} Total Enrolled Staff</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="ACTIVE ON FLOOR"
          value={activeCount}
          subtitle="Operating machine bays"
          icon={UserCheck}
          variant="green"
        />

        <StatCard
          title="ON SCHEDULED BREAK"
          value={breakCount}
          subtitle="Tea / lunch break"
          icon={Coffee}
          variant="amber"
        />

        <StatCard
          title="ABSENT / OFF SHIFT"
          value={absentCount}
          subtitle="Requires floor coverage"
          icon={UserX}
          variant="rose"
        />
      </div>

      {/* Register New Worker Form */}
      <form onSubmit={handleSubmit} className="heavy-card rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">
              Register New Floor Worker / Operator
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">HR & Floor Allocation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">FULL NAME</label>
            <input
              type="text"
              placeholder="e.g. Nilesh Patel"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">WORKER ID</label>
            <input
              type="text"
              placeholder="e.g. W-101"
              value={workerId}
              onChange={e => setWorkerId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">ROLE</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              <option>Loom Operator</option>
              <option>Senior Loom Master</option>
              <option>Chief Mechanic</option>
              <option>Quality Inspector</option>
              <option>Weft Feeder Tech</option>
              <option>Floor Supervisor</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">ASSIGNED MACHINES</label>
            <input
              type="text"
              placeholder="e.g. M-01 to M-06"
              value={machine}
              onChange={e => setMachine(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">SHIFT</label>
            <select
              value={shift}
              onChange={e => setShift(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              <option>Morning (6AM - 2PM)</option>
              <option>Afternoon (2PM - 10PM)</option>
              <option>Night (10PM - 6AM)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">PHONE NUMBER</label>
            <input
              type="tel"
              placeholder="+91 98XXX XXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Enroll Staff Member
          </button>
        </div>
      </form>

      {/* Workers Roster Grid */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">
              Active Floor Staff Directory
            </h3>
            <p className="text-xs text-slate-500">Real-time attendance status and machine allocation</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No staff members enrolled yet.</p>
            <p className="text-xs text-slate-400">Fill the enrollment form above to register your first worker.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map(w => {
              const isActive = w.status === 'active';
              const isBreak = w.status === 'break';

              return (
                <div key={w.id} className="heavy-card rounded-2xl p-4 border border-slate-200/90 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{w.name}</h4>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {w.id}
                            </span>
                          </div>
                          <p className="text-xs text-sky-700 font-semibold">{w.role}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isActive ? 'bg-emerald-100 text-emerald-800' :
                        isBreak ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {w.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Assigned Looms:</span>
                        <span className="font-bold text-slate-800 font-mono">{w.machine}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Shift Schedule:</span>
                        <span>{w.shift}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Direct Contact:</span>
                        <span className="font-mono text-slate-700">{w.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle & Call Button & Delete */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateWorkerStatus(w.id, 'active')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => updateWorkerStatus(w.id, 'break')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${isBreak ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Break
                      </button>
                      <button
                        onClick={() => updateWorkerStatus(w.id, 'absent')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${w.status === 'absent' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Absent
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const msg = buildWorkerDutySlipMessage(w);
                          openWhatsApp({ phone: w.phone, message: msg });
                          showToast(`Duty roster slip sent to ${w.name} on WhatsApp!`, 'success');
                        }}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg transition-colors"
                        title="Send Shift Duty Slip via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => showToast(`Calling ${w.name} (${w.phone})...`, 'info')}
                        className="p-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 rounded-lg transition-colors"
                        title="Call Worker"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>

                      {userRole === 'Admin' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete worker ${w.name}?`)) {
                              deleteWorker(w.id);
                            }
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg transition-colors"
                          title="Delete Worker (Admin Only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
