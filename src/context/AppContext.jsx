import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEMO_MACHINES,
  DEMO_WORKERS,
  DEMO_ALARMS,
  DEMO_STOCK,
  DEMO_BROKERS,
  DEMO_READY_GOODS,
  DEMO_SALES_ORDERS,
  DEMO_CAMERAS,
  DEMO_PRODUCTION_LOGS
} from '../data/initialData';
import { soundEffects } from '../utils/soundEffects';

const AppContext = createContext();

const STORAGE_KEYS = {
  MACHINES: 'loomus_machines_v2',
  WORKERS: 'loomus_workers_v2',
  ALARMS: 'loomus_alarms_v2',
  STOCK: 'loomus_stock_v2',
  READY_GOODS: 'loomus_ready_goods_v2',
  BROKERS: 'loomus_brokers_v2',
  SALES_ORDERS: 'loomus_sales_orders_v2',
  CAMERAS: 'loomus_cameras_v2',
  PRODUCTION_LOGS: 'loomus_production_logs_v2'
};

function getSavedData(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to read from localStorage', e);
  }
  return fallback;
}

export function AppProvider({ children }) {
  // Authentication & Session Persistence
  const savedSession = (() => {
    try {
      const s = localStorage.getItem('loomus_auth_session_v2');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return null;
  })();

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!savedSession);
  const [userRole, setUserRole] = useState(() => savedSession?.role || 'Admin'); // 'Admin' | 'Supervisor' | 'Operator'
  const [currentUser, setCurrentUser] = useState(() => savedSession?.user || {
    username: 'Admin',
    displayName: 'Mill Administrator',
    avatar: 'A'
  });

  // Navigation
  const [activeTab, setActiveTab] = useState(() => {
    const role = savedSession?.role || 'Admin';
    if (role === 'Operator') return 'operator-console';
    if (role === 'Supervisor') return 'supervisor-floor';
    return 'dashboard';
  });
  
  // Theme & Preferences
  const [theme, setTheme] = useState('light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [powerLoadPercent, setPowerLoadPercent] = useState(0);

  // Core Data States - Defaulting to EMPTY as requested by the user!
  const [machines, setMachines] = useState(() => getSavedData(STORAGE_KEYS.MACHINES, []));
  const [workers, setWorkers] = useState(() => getSavedData(STORAGE_KEYS.WORKERS, []));
  const [alarms, setAlarms] = useState(() => getSavedData(STORAGE_KEYS.ALARMS, []));
  const [stockLevels, setStockLevels] = useState(() => getSavedData(STORAGE_KEYS.STOCK, []));
  const [readyGoods, setReadyGoods] = useState(() => getSavedData(STORAGE_KEYS.READY_GOODS, []));
  const [brokers, setBrokers] = useState(() => getSavedData(STORAGE_KEYS.BROKERS, []));
  const [salesOrders, setSalesOrders] = useState(() => getSavedData(STORAGE_KEYS.SALES_ORDERS, []));
  const [cameras, setCameras] = useState(() => getSavedData(STORAGE_KEYS.CAMERAS, []));
  const [productionLogs, setProductionLogs] = useState(() => getSavedData(STORAGE_KEYS.PRODUCTION_LOGS, []));

  // Selected Machine for Inspection Modal or HMI
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [activeOperatorLoom, setActiveOperatorLoom] = useState(null);

  // Modals & Navigation Drawers
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);
  const [isAddMachineOpen, setIsAddMachineOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Admin & Departmental WhatsApp Phone Numbers for Instant Reporting
  const DEFAULT_ADMIN_PHONE = '+91 75675 74107';

  const [adminWhatsAppPhone, setAdminWhatsAppPhoneState] = useState(() => {
    try {
      const saved = localStorage.getItem('loomus_admin_whatsapp');
      if (!saved || saved === '+91 98765 43210' || saved.includes('98765 43210')) {
        localStorage.setItem('loomus_admin_whatsapp', DEFAULT_ADMIN_PHONE);
        return DEFAULT_ADMIN_PHONE;
      }
      return saved;
    } catch (e) {
      return DEFAULT_ADMIN_PHONE;
    }
  });

  const [godownWhatsAppPhone, setGodownWhatsAppPhoneState] = useState(() => {
    try {
      return localStorage.getItem('loomus_godown_whatsapp') || DEFAULT_ADMIN_PHONE;
    } catch (e) {
      return DEFAULT_ADMIN_PHONE;
    }
  });

  const [salesWhatsAppPhone, setSalesWhatsAppPhoneState] = useState(() => {
    try {
      return localStorage.getItem('loomus_sales_whatsapp') || DEFAULT_ADMIN_PHONE;
    } catch (e) {
      return DEFAULT_ADMIN_PHONE;
    }
  });

  const setAdminWhatsAppPhone = (phone) => {
    setAdminWhatsAppPhoneState(phone);
    try {
      localStorage.setItem('loomus_admin_whatsapp', phone);
    } catch (e) {}
  };

  const setGodownWhatsAppPhone = (phone) => {
    setGodownWhatsAppPhoneState(phone);
    try {
      localStorage.setItem('loomus_godown_whatsapp', phone);
    } catch (e) {}
  };

  const setSalesWhatsAppPhone = (phone) => {
    setSalesWhatsAppPhoneState(phone);
    try {
      localStorage.setItem('loomus_sales_whatsapp', phone);
    } catch (e) {}
  };

  // WhatsApp Recipient & Share Modal State (Choose who to send to)
  const [whatsAppShareData, setWhatsAppShareData] = useState({
    isOpen: false,
    title: '',
    message: '',
    category: 'general', // 'sales' | 'godown' | 'analytics' | 'worker' | 'general'
    defaultPhone: DEFAULT_ADMIN_PHONE,
    entityName: ''
  });

  const openWhatsAppShare = ({ title, message, category = 'general', defaultPhone = '', entityName = '' }) => {
    setWhatsAppShareData({
      isOpen: true,
      title: title || 'Send WhatsApp Report',
      message: message || '',
      category,
      defaultPhone: defaultPhone || adminWhatsAppPhone || DEFAULT_ADMIN_PHONE,
      entityName
    });
  };

  const closeWhatsAppShare = () => {
    setWhatsAppShareData(prev => ({ ...prev, isOpen: false }));
  };

  // Floating Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Sync active operator loom when machines change
  useEffect(() => {
    if (machines.length > 0) {
      if (!activeOperatorLoom || !machines.some(m => m.id === activeOperatorLoom)) {
        setActiveOperatorLoom(machines[0].id);
      }
    } else {
      setActiveOperatorLoom(null);
    }
  }, [machines, activeOperatorLoom]);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALARMS, JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stockLevels));
  }, [stockLevels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.READY_GOODS, JSON.stringify(readyGoods));
  }, [readyGoods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BROKERS, JSON.stringify(brokers));
  }, [brokers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_ORDERS, JSON.stringify(salesOrders));
  }, [salesOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras));
  }, [cameras]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTION_LOGS, JSON.stringify(productionLogs));
  }, [productionLogs]);

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    if (soundEnabled) {
      if (type === 'error') soundEffects.alarm();
      else if (type === 'success') soundEffects.success();
      else soundEffects.click();
    }
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3200);
  };

  // Switch Role Helper (Restricted exclusively to Admin for testing/oversight)
  const switchRole = (role) => {
    if (userRole !== 'Admin') {
      showToast('Permission Denied: Please logout and login with role credentials to switch accounts.', 'error');
      return;
    }
    setUserRole(role);
    if (soundEnabled) soundEffects.click();
    if (role === 'Admin') {
      setCurrentUser({ username: 'Admin', displayName: 'Mill Administrator', avatar: 'A' });
      setActiveTab('dashboard');
      showToast('Switched to Admin Executive Suite', 'info');
    } else if (role === 'Supervisor') {
      setCurrentUser({ username: 'Supervisor', displayName: 'Floor Supervisor', avatar: 'S' });
      setActiveTab('supervisor-floor');
      showToast('Previewing Supervisor Floor Console', 'info');
    } else if (role === 'Operator') {
      setCurrentUser({ username: 'Operator', displayName: 'Loom Operator', avatar: 'O' });
      setActiveTab('operator-console');
      showToast('Previewing Industrial Operator HMI', 'info');
    }
  };

  const login = (role, username) => {
    const userObj = {
      username: username || role,
      displayName: role === 'Admin' ? 'Mill Administrator' : role === 'Supervisor' ? 'Floor Supervisor' : 'Loom Operator',
      avatar: role[0].toUpperCase()
    };
    const defaultTab = role === 'Operator' ? 'operator-console' : role === 'Supervisor' ? 'supervisor-floor' : 'dashboard';

    setUserRole(role);
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    setActiveTab(defaultTab);

    try {
      localStorage.setItem('loomus_auth_session_v2', JSON.stringify({ role, user: userObj }));
    } catch (e) {}

    if (soundEnabled) soundEffects.success();
    showToast(`Welcome back, ${userObj.displayName} (${role} Portal)!`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('loomus_auth_session_v2');
    } catch (e) {}
    if (soundEnabled) soundEffects.click();
    showToast('Logged out of session', 'info');
  };

  // ─── DATA PURGE / RESET & DEMO LOADER ───
  const clearAllData = () => {
    setMachines([]);
    setWorkers([]);
    setAlarms([]);
    setStockLevels([]);
    setReadyGoods([]);
    setBrokers([]);
    setSalesOrders([]);
    setCameras([]);
    setProductionLogs([]);
    setSelectedMachineId(null);
    setActiveOperatorLoom(null);
    setPowerLoadPercent(0);

    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    if (soundEnabled) soundEffects.alarm();
    showToast('Pura data delete ho gaya hai! Sab kuch fresh 0 se ready hai.', 'warning');
  };

  const loadDemoData = () => {
    setMachines(DEMO_MACHINES);
    setWorkers(DEMO_WORKERS);
    setAlarms(DEMO_ALARMS);
    setStockLevels(DEMO_STOCK);
    setReadyGoods(DEMO_READY_GOODS);
    setBrokers(DEMO_BROKERS);
    setSalesOrders(DEMO_SALES_ORDERS);
    setCameras(DEMO_CAMERAS);
    setProductionLogs(DEMO_PRODUCTION_LOGS);
    setActiveOperatorLoom('M-01');
    setPowerLoadPercent(72);

    if (soundEnabled) soundEffects.success();
    showToast('Demo reference data load ho gaya hai!', 'success');
  };

  // Export & Import Backup JSON
  const exportDataJSON = () => {
    const data = {
      machines,
      workers,
      alarms,
      stockLevels,
      readyGoods,
      brokers,
      salesOrders,
      cameras,
      productionLogs,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loomus_factory_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Factory data backup JSON downloaded!', 'success');
  };

  const importDataJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.machines) setMachines(data.machines);
      if (data.workers) setWorkers(data.workers);
      if (data.alarms) setAlarms(data.alarms);
      if (data.stockLevels) setStockLevels(data.stockLevels);
      if (data.readyGoods) setReadyGoods(data.readyGoods);
      if (data.brokers) setBrokers(data.brokers);
      if (data.salesOrders) setSalesOrders(data.salesOrders);
      if (data.cameras) setCameras(data.cameras);
      if (data.productionLogs) setProductionLogs(data.productionLogs);
      showToast('Backup data imported successfully!', 'success');
    } catch (e) {
      showToast('Invalid JSON backup file!', 'error');
    }
  };

  // ─── MACHINE CRUD ───
  const addMachine = (machineData) => {
    const isExisting = machines.some(m => m.id.toLowerCase() === machineData.id.toLowerCase());
    if (isExisting) {
      showToast(`Machine ID ${machineData.id} already exists!`, 'error');
      return false;
    }

    const newMachine = {
      id: machineData.id.trim(),
      name: machineData.name || `Loom Unit ${machineData.id}`,
      shed: machineData.shed || 'Main Shed',
      model: machineData.model || 'Airjet Weaving Loom',
      status: 'idle',
      rpm: 0,
      targetRpm: parseInt(machineData.targetRpm) || 850,
      fabric: machineData.fabric || '70*72 Plain Cambric',
      output: 0,
      targetOutput: parseInt(machineData.targetOutput) || 75,
      efficiency: 0,
      temp: 28,
      tension: 0,
      pressure: 0,
      picksPerMin: 0,
      weftStops: 0,
      warpStops: 0,
      operator: machineData.operator || 'Unassigned',
      lastMaintenance: new Date().toISOString().split('T')[0]
    };

    setMachines(prev => [...prev, newMachine]);
    if (!activeOperatorLoom) setActiveOperatorLoom(newMachine.id);
    if (soundEnabled) soundEffects.success();
    showToast(`Machine ${newMachine.id} added to ${newMachine.shed}!`, 'success');
    return true;
  };

  const deleteMachine = (machineId) => {
    setMachines(prev => prev.filter(m => m.id !== machineId));
    if (selectedMachineId === machineId) setSelectedMachineId(null);
    if (activeOperatorLoom === machineId) {
      const remaining = machines.filter(m => m.id !== machineId);
      setActiveOperatorLoom(remaining[0]?.id || null);
    }
    showToast(`Machine ${machineId} deleted`, 'info');
  };

  // Machine Actions
  const updateMachineStatus = (machineId, status) => {
    setMachines(prev => prev.map(m => {
      if (m.id === machineId || machineId === 'all') {
        const isNowRunning = status === 'running';
        return {
          ...m,
          status,
          rpm: isNowRunning ? (m.targetRpm || 850) : 0,
          pressure: isNowRunning ? 4.5 : 0,
          tension: isNowRunning ? 65 : 0
        };
      }
      return m;
    }));
    if (soundEnabled) {
      if (status === 'running') soundEffects.machineStart();
      else if (status === 'stopped') soundEffects.alarm();
      else soundEffects.click();
    }
    showToast(`Machine ${machineId}: status set to ${status.toUpperCase()}`, status === 'stopped' ? 'warning' : 'success');
  };

  const emergencyStopAll = () => {
    setMachines(prev => prev.map(m => ({
      ...m,
      status: 'stopped',
      rpm: 0,
      pressure: 0,
      tension: 0
    })));
    const newAlarm = {
      id: `AL-${Date.now().toString().slice(-4)}`,
      type: 'critical',
      title: `EMERGENCY STOP TRIGGERED BY ${currentUser.username}`,
      machine: 'FACTORY-WIDE',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shed: 'All Sheds',
      code: 'E-STOP'
    };
    setAlarms(prev => [newAlarm, ...prev]);
    if (soundEnabled) soundEffects.emergency();
    showToast('🚨 FACTORY EMERGENCY STOP ACTIVATED!', 'error');
  };

  const startAllMachines = () => {
    if (machines.length === 0) {
      showToast('No machines configured yet! Add a loom first.', 'warning');
      return;
    }
    updateMachineStatus('all', 'running');
    showToast(`All ${machines.length} Loom units activated`, 'success');
  };

  const stopAllMachines = () => {
    if (machines.length === 0) return;
    updateMachineStatus('all', 'stopped');
    showToast('All Loom units halted safely', 'warning');
  };

  // ─── ALARMS ───
  const ackAlarm = (alarmId) => {
    setAlarms(prev => prev.filter(a => a.id !== alarmId));
    if (soundEnabled) soundEffects.click();
    showToast('Alarm acknowledged & cleared', 'info');
  };

  const ackAllAlarms = () => {
    setAlarms([]);
    if (soundEnabled) soundEffects.success();
    showToast('All alarms acknowledged', 'success');
  };

  const addTestAlarm = () => {
    const randomLoom = machines.length > 0 ? machines[Math.floor(Math.random() * machines.length)].id : 'M-01';
    const testAlarms = [
      { title: `${randomLoom}: Weft Yarn Sensor Tripped`, type: 'warning', code: 'W-081' },
      { title: `${randomLoom}: Lubrication Pressure Warning`, type: 'warning', code: 'W-033' },
      { title: `${randomLoom}: Warp Tension Exceeded 85%`, type: 'critical', code: 'E-012' }
    ];
    const picked = testAlarms[Math.floor(Math.random() * testAlarms.length)];
    const newAlarm = {
      id: `AL-${Date.now().toString().slice(-4)}`,
      type: picked.type,
      title: picked.title,
      machine: randomLoom,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shed: 'Main Shed',
      code: picked.code
    };
    setAlarms(prev => [newAlarm, ...prev]);
    if (soundEnabled) soundEffects.alarm();
    showToast(`New ${picked.type.toUpperCase()} Alarm: ${picked.title}`, 'warning');
  };

  // ─── WORKER CRUD ───
  const addWorker = (workerData) => {
    setWorkers(prev => [workerData, ...prev]);
    showToast(`Worker ${workerData.name} registered`, 'success');
  };

  const deleteWorker = (workerId) => {
    setWorkers(prev => prev.filter(w => w.id !== workerId));
    showToast('Worker removed', 'info');
  };

  const updateWorkerStatus = (workerId, newStatus) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, status: newStatus } : w));
    showToast(`Worker status updated to ${newStatus}`, 'info');
  };

  // ─── RAW MATERIAL CRUD ───
  const addRawMaterial = (entry) => {
    setStockLevels(prev => {
      const existing = prev.find(s => s.name.toLowerCase() === entry.material.toLowerCase());
      if (existing) {
        return prev.map(s => s.id === existing.id ? { ...s, current: s.current + entry.qty, supplier: entry.supplier || s.supplier, rate: entry.rate || s.rate } : s);
      }
      return [
        {
          id: `ST-${Date.now().toString().slice(-4)}`,
          name: entry.material,
          current: entry.qty,
          max: entry.qty * 2 || 2000,
          unit: 'kg',
          rate: entry.rate || 250,
          minThreshold: Math.round(entry.qty * 0.25),
          category: 'Spun Yarn',
          supplier: entry.supplier || 'Spinning Mill'
        },
        ...prev
      ];
    });
    showToast(`Added ${entry.qty} kg of ${entry.material}`, 'success');
  };

  const deleteStock = (stockId) => {
    setStockLevels(prev => prev.filter(s => s.id !== stockId));
    showToast('Material stock deleted', 'info');
  };

  // ─── SALES & READY GOODS CRUD ───
  const addReadyGoods = (goods) => {
    setReadyGoods(prev => [goods, ...prev]);
    showToast(`Ready goods roll lot logged (${goods.qty}m)`, 'success');
  };

  const deleteReadyGoods = (goodsId) => {
    setReadyGoods(prev => prev.filter(g => g.id !== goodsId));
    showToast('Ready goods entry deleted', 'info');
  };

  const addBroker = (broker) => {
    setBrokers(prev => [broker, ...prev]);
    showToast(`Broker ${broker.name} registered successfully`, 'success');
  };

  const deleteBroker = (brokerId) => {
    setBrokers(prev => prev.filter(b => b.id !== brokerId));
    showToast('Broker removed', 'info');
  };

  const addSalesOrder = (order) => {
    setSalesOrders(prev => [order, ...prev]);
    showToast(`Sales order created: ${order.id}`, 'success');
  };

  const deleteSalesOrder = (orderId) => {
    setSalesOrders(prev => prev.filter(o => o.id !== orderId));
    showToast('Order removed', 'info');
  };

  const updateOrderStatus = (orderId, status) => {
    setSalesOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order ${orderId} updated to ${status}`, 'info');
  };

  // ─── CAMERA CRUD ───
  const toggleCamera = (camId) => {
    setCameras(prev => prev.map(c => {
      if (c.id === camId) {
        const nextState = !c.connected;
        showToast(`${c.name}: ${nextState ? 'Stream Connected' : 'Stream Disconnected'}`, nextState ? 'success' : 'info');
        return { ...c, connected: nextState };
      }
      return c;
    }));
  };

  const addCamera = (newCam) => {
    setCameras(prev => [...prev, newCam]);
    showToast(`Camera ${newCam.name} connected to EasyViewer hub`, 'success');
  };

  const deleteCamera = (camId) => {
    setCameras(prev => prev.filter(c => c.id !== camId));
    showToast('Camera deleted', 'info');
  };

  // ─── PRODUCTION LOG ───
  const addProductionLog = (log) => {
    setProductionLogs(prev => [log, ...prev]);
    setMachines(prev => prev.map(m => {
      if (m.id === log.machine) {
        const newOutput = m.output + log.output;
        const newEff = Math.min(100, Math.round((newOutput / (m.targetOutput || 75)) * 100));
        return { ...m, output: newOutput, efficiency: newEff };
      }
      return m;
    }));
    showToast(`Production logged: ${log.output}m from ${log.machine}`, 'success');
  };

  const deleteProductionLog = (logId) => {
    setProductionLogs(prev => prev.filter(l => l.id !== logId));
    showToast('Production entry deleted', 'info');
  };

  // Live Machine Telemetry Simulation Effect (Only when running machines exist)
  useEffect(() => {
    const interval = setInterval(() => {
      const runningMachines = machines.filter(m => m.status === 'running');
      if (runningMachines.length === 0) {
        setPowerLoadPercent(0);
        return;
      }

      setMachines(prev => prev.map(m => {
        if (m.status === 'running') {
          const deltaRpm = Math.floor(Math.random() * 14 - 7);
          const newRpm = Math.max(500, Math.min(1100, m.rpm + deltaRpm));
          const deltaTemp = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const newTemp = Math.max(30, Math.min(60, m.temp + deltaTemp));
          const pickIncrement = Math.random() > 0.6 ? 1 : 0;
          return {
            ...m,
            rpm: newRpm,
            temp: newTemp,
            output: m.output + pickIncrement,
            picksPerMin: Math.floor(newRpm * 0.94)
          };
        }
        return m;
      }));

      // Calculate realistic power based on running count
      const computedLoad = Math.min(95, Math.round((runningMachines.length / Math.max(1, machines.length)) * 80 + 10));
      setPowerLoadPercent(computedLoad);
    }, 3500);

    return () => clearInterval(interval);
  }, [machines]);

  const value = {
    isAuthenticated,
    userRole,
    currentUser,
    activeTab,
    theme,
    soundEnabled,
    powerLoadPercent,
    machines,
    alarms,
    workers,
    stockLevels,
    readyGoods,
    brokers,
    salesOrders,
    cameras,
    productionLogs,
    selectedMachineId,
    activeOperatorLoom,
    toast,
    isDataManagerOpen,
    isAddMachineOpen,
    isMobileMenuOpen,
    isWhatsAppModalOpen,
    setIsDataManagerOpen,
    setIsAddMachineOpen,
    setIsMobileMenuOpen,
    setIsWhatsAppModalOpen,
    adminWhatsAppPhone,
    setAdminWhatsAppPhone,
    godownWhatsAppPhone,
    setGodownWhatsAppPhone,
    salesWhatsAppPhone,
    setSalesWhatsAppPhone,
    whatsAppShareData,
    openWhatsAppShare,
    closeWhatsAppShare,
    setActiveTab,
    setTheme,
    setSoundEnabled,
    setSelectedMachineId,
    setActiveOperatorLoom,
    switchRole,
    login,
    logout,
    showToast,
    clearAllData,
    loadDemoData,
    exportDataJSON,
    importDataJSON,
    addMachine,
    deleteMachine,
    updateMachineStatus,
    emergencyStopAll,
    startAllMachines,
    stopAllMachines,
    ackAlarm,
    ackAllAlarms,
    addTestAlarm,
    addWorker,
    deleteWorker,
    updateWorkerStatus,
    addRawMaterial,
    deleteStock,
    addReadyGoods,
    deleteReadyGoods,
    addBroker,
    deleteBroker,
    addSalesOrder,
    deleteSalesOrder,
    updateOrderStatus,
    toggleCamera,
    addCamera,
    deleteCamera,
    addProductionLog,
    deleteProductionLog
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
