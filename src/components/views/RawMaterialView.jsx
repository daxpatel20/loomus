import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatCard from '../common/StatCard';
import { formatRupees } from '../../utils/formatters';
import { openWhatsApp, buildYarnInwardMessage } from '../../utils/whatsapp';
import {
  Layers,
  Plus,
  AlertCircle,
  Package,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Building,
  Trash2,
  MessageSquare,
  Send
} from 'lucide-react';

export default function RawMaterialView() {
  const {
    stockLevels,
    userRole,
    addRawMaterial,
    deleteStock,
    adminWhatsAppPhone,
    godownWhatsAppPhone,
    openWhatsAppShare,
    showToast
  } = useApp();

  const [material, setMaterial] = useState('Cotton Yarn 40s Combed');
  const [customMaterial, setCustomMaterial] = useState('');
  const [qty, setQty] = useState('');
  const [supplier, setSupplier] = useState('');
  const [rate, setRate] = useState('');
  const [invoice, setInvoice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Inventory Valuation
  const totalStockKg = stockLevels.reduce((acc, s) => acc + s.current, 0);
  const totalValuation = stockLevels.reduce((acc, s) => acc + (s.current * s.rate), 0);
  const lowStockCount = stockLevels.filter(s => (s.current / s.max) < 0.35).length;

  const handleAddStock = (e) => {
    e.preventDefault();
    const qtyNum = parseFloat(qty);
    const rateNum = parseFloat(rate);

    if (!qtyNum || qtyNum <= 0) {
      showToast('Please enter valid yarn quantity', 'error');
      return;
    }

    const finalMaterial = customMaterial.trim() ? customMaterial.trim() : material;
    const newLot = {
      material: finalMaterial,
      qty: qtyNum,
      supplier: supplier || 'Local Spinning Mill',
      rate: rateNum || 250,
      invoice: invoice || `INV-${Date.now().toString().slice(-5)}`,
      date
    };

    addRawMaterial(newLot);

    // Prompt WhatsApp Inward Slip with Recipient Selector (Admin, Godown, Supplier, etc.)
    openWhatsAppShare({
      title: `Maal Aaya (Yarn Inward) - ${newLot.material}`,
      message: buildYarnInwardMessage(newLot),
      category: 'godown',
      defaultPhone: adminWhatsAppPhone
    });

    showToast('Maal Aaya (Yarn Inward) added! Select recipient to send WhatsApp slip.', 'success');

    setQty('');
    setRate('');
    setSupplier('');
    setInvoice('');
    setCustomMaterial('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
              Yarn Warehouse & Sizing Stock
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900">
            Raw Yarn Material & Supplier Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor combed cotton cones, polyester filament bobbins, viscose rayon, and denim warp beam stocks.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Send Full Yarn Stock Summary on WhatsApp */}
          <button
            onClick={() => {
              const summaryMsg = `🏭 *LOOMUS TEXTILE MILL — GODOWN YARN STOCK REPORT*\n📅 *Date:* ${new Date().toLocaleDateString('en-IN')}\n----------------------------------------\n⚖️ *Total Yarn in Godown:* ${totalStockKg.toLocaleString()} kg\n💰 *Total Stock Valuation:* ${formatRupees(totalValuation)}\n📦 *Varieties in Stock:* ${stockLevels.length} items\n----------------------------------------\n${stockLevels.map(s => `• ${s.name}: ${s.current} ${s.unit} (@ ₹${s.rate}/kg)`).join('\n')}\n----------------------------------------\n🏢 *Surat Central Textile Mill*`;
              openWhatsAppShare({
                title: 'Godown Yarn Stock Report',
                message: summaryMsg,
                category: 'godown',
                defaultPhone: godownWhatsAppPhone || adminWhatsAppPhone
              });
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            title="Send Godown Stock Report via WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>WhatsApp Godown Report</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>{stockLevels.length} Yarn Varieties</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="TOTAL YARN IN STOCK"
          value={totalStockKg.toLocaleString()}
          unit="kg"
          subtitle="Available for warping & creels"
          icon={Package}
          variant="blue"
        />

        <StatCard
          title="INVENTORY VALUATION"
          value={formatRupees(totalValuation)}
          subtitle="Current purchase market value"
          icon={Layers}
          variant="green"
        />

        <StatCard
          title="CRITICAL REORDER ITEMS"
          value={lowStockCount}
          subtitle="Below 35% safety threshold"
          icon={AlertCircle}
          variant={lowStockCount > 0 ? 'rose' : 'green'}
        />
      </div>

      {/* Add Raw Yarn Stock Form */}
      <form onSubmit={handleAddStock} className="heavy-card rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider">
              Receive New Yarn Lot / Purchase Inward
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Inventory Inflow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">MATERIAL / YARN TYPE</label>
            <input
              type="text"
              placeholder="e.g. Cotton 40s or Polyester 75D"
              value={customMaterial}
              onChange={e => setCustomMaterial(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">QUANTITY (KG)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={qty}
              onChange={e => setQty(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">SUPPLIER / MILL</label>
            <input
              type="text"
              placeholder="e.g. Vardhman Textiles"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">PURCHASE RATE (₹/KG)</label>
            <input
              type="number"
              placeholder="e.g. 280"
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">INVOICE NO</label>
            <input
              type="text"
              placeholder="INV-2026-XXXX"
              value={invoice}
              onChange={e => setInvoice(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">RECEIVED DATE</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Yarn Stock to Warehouse
          </button>
        </div>
      </form>

      {/* Stock Level Cards */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6">
        <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider mb-4">
          Current Warehouse Inventory Reserves
        </h3>

        {stockLevels.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No yarn material in stock.</p>
            <p className="text-xs text-slate-400">Use the form above to add your first yarn batch into godown.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stockLevels.map(s => {
              const pct = Math.round((s.current / s.max) * 100);
              const isLow = pct < 35;
              const stockValuation = s.current * s.rate;

              return (
                <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Supplier: {s.supplier}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isLow ? 'REORDER NOW' : 'IN STOCK'}
                      </span>

                      {userRole === 'Admin' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${s.name}?`)) deleteStock(s.id);
                          }}
                          className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-all"
                          title="Delete Material (Admin Only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Current Reserve: <strong className="font-mono text-slate-900">{s.current} {s.unit}</strong></span>
                      <span className="text-slate-500 font-mono">Max Capacity: {s.max} {s.unit} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-rose-500' : pct < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 text-slate-500 font-mono">
                    <span>Rate: ₹{s.rate}/kg</span>
                    <span className="font-bold text-slate-800">Total Lot: {formatRupees(stockValuation)}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => {
                        openWhatsAppShare({
                          title: `Maal Aaya Inward Slip (${s.name})`,
                          message: buildYarnInwardMessage(s),
                          category: 'godown',
                          defaultPhone: godownWhatsAppPhone || adminWhatsAppPhone
                        });
                      }}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                      title="Send Maal Aaya Inward Slip on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>Send Maal Aaya Slip</span>
                    </button>
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
