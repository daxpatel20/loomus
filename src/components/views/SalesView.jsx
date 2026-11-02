import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatCard from '../common/StatCard';
import { formatRupees, formatMeters } from '../../utils/formatters';
import {
  openWhatsApp,
  buildSalesOrderMessage,
  buildReadyGoodsMessage
} from '../../utils/whatsapp';
import {
  Briefcase,
  TrendingUp,
  Boxes,
  Users,
  Plus,
  Phone,
  MessageSquare,
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  Trash2
} from 'lucide-react';

export default function SalesView() {
  const {
    brokers,
    readyGoods,
    salesOrders,
    addReadyGoods,
    deleteReadyGoods,
    addBroker,
    deleteBroker,
    addSalesOrder,
    deleteSalesOrder,
    updateOrderStatus,
    adminWhatsAppPhone,
    salesWhatsAppPhone,
    openWhatsAppShare,
    showToast
  } = useApp();

  // Ready Goods State
  const [rgFabric, setRgFabric] = useState('70*72 Plain Cambric');
  const [rgCustomFabric, setRgCustomFabric] = useState('');
  const [rgQty, setRgQty] = useState('');
  const [rgRate, setRgRate] = useState('48');
  const [rgQuality, setRgQuality] = useState('A-Grade (Export)');

  // Broker State
  const [bName, setBName] = useState('');
  const [bCompany, setBCompany] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bCity, setBCity] = useState('Surat');
  const [bComm, setBComm] = useState('2.0');
  const [bType, setBType] = useState('Broker');

  // Sales Order State
  const [soBroker, setSoBroker] = useState(brokers[0]?.name || '');
  const [soBuyer, setSoBuyer] = useState('');
  const [soFabric, setSoFabric] = useState('70*72 Plain Cambric');
  const [soQty, setSoQty] = useState('');
  const [soRate, setSoRate] = useState('48');
  const [soDelivery, setSoDelivery] = useState('2026-11-08');

  // Totals
  const totalReadyMeters = readyGoods.reduce((acc, g) => acc + g.qty, 0);
  const totalOrderValue = salesOrders.reduce((acc, o) => acc + o.total, 0);

  const handleAddReadyGoods = (e) => {
    e.preventDefault();
    const qtyNum = parseFloat(rgQty);
    const rateNum = parseFloat(rgRate);
    if (!qtyNum || qtyNum <= 0) {
      showToast('Please enter valid ready goods meters', 'error');
      return;
    }
    const finalFabric = rgCustomFabric.trim() ? rgCustomFabric.trim() : rgFabric;
    addReadyGoods({
      id: `RG-${Date.now().toString().slice(-4)}`,
      fabric: finalFabric,
      qty: qtyNum,
      rollCount: Math.ceil(qtyNum / 100),
      quality: rgQuality,
      rate: rateNum || 45,
      location: 'Rack Warehouse',
      status: 'Ready'
    });
    setRgQty('');
    setRgCustomFabric('');
  };

  const handleAddBroker = (e) => {
    e.preventDefault();
    if (!bName.trim()) {
      showToast('Please enter broker name', 'error');
      return;
    }
    addBroker({
      id: `BR-${Date.now().toString().slice(-4)}`,
      name: bName.trim(),
      contactPerson: bName.trim(),
      company: bCompany.trim() || 'Textile Agency',
      phone: bPhone.trim() || '+91 99000 00000',
      city: bCity.trim(),
      type: bType,
      comm: parseFloat(bComm) || 2.0,
      totalDeals: 1,
      activeOrders: 0,
      rating: 5.0
    });
    setBName('');
    setBCompany('');
    setBPhone('');
  };

  const handleAddOrder = (e) => {
    e.preventDefault();
    const qtyNum = parseFloat(soQty);
    const rateNum = parseFloat(soRate);
    if (!qtyNum || !rateNum) {
      showToast('Please fill all order quantity and rate fields', 'error');
      return;
    }
    const total = qtyNum * rateNum;
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      broker: soBroker || 'Direct Mill Sale',
      buyer: soBuyer.trim() || 'Textile Buyer',
      fabric: soFabric,
      qty: qtyNum,
      rate: rateNum,
      total,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: soDelivery,
      status: 'In Production',
      advance: Math.round(total * 0.25)
    };
    addSalesOrder(newOrder);

    // Prompt WhatsApp dispatch with Recipient Chooser (Admin, Sales Incharge, Broker, Buyer, Custom)
    openWhatsAppShare({
      title: `Sales Order ${newOrder.id} (Maal Gaya)`,
      message: buildSalesOrderMessage(newOrder),
      category: 'sales',
      defaultPhone: adminWhatsAppPhone
    });

    showToast(`Order ${newOrder.id} booked! Select recipient to send WhatsApp slip.`, 'success');

    setSoQty('');
    setSoBuyer('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
              Surat Commercial Hub
            </span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Sales, Brokers & Finished Goods Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage fabric roll dispatches, wholesale buyers, Surat/Bhiwandi brokers, and contract orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const totalOrderVal = salesOrders.reduce((acc, o) => acc + o.total, 0);
              const totalMeters = salesOrders.reduce((acc, o) => acc + o.qty, 0);
              const readyMeters = readyGoods.reduce((acc, g) => acc + g.qty, 0);
              const msg = `💼 *LOOMUS TEXTILE — COMMERCIAL & SALES SUMMARY REPORT*
📅 *Date:* ${new Date().toLocaleDateString('en-IN')}
----------------------------------------
🏷️ *Confirmed Sales Orders:* ${salesOrders.length} orders
📏 *Total Ordered Fabric:* ${totalMeters.toLocaleString()} meters
💰 *Total Commercial Value:* ₹${totalOrderVal.toLocaleString()}
📦 *Ready Goods in Godown:* ${readyMeters.toLocaleString()} meters
🤝 *Active Broker Network:* ${brokers.length} partners
----------------------------------------
🏢 Surat Commercial Sales Hub`;
              openWhatsAppShare({
                title: 'Commercial Sales Summary Report',
                message: msg,
                category: 'sales',
                defaultPhone: salesWhatsAppPhone || adminWhatsAppPhone
              });
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Sales Report</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>Commercial Hub</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="ACTIVE SALES ORDERS"
          value={formatRupees(totalOrderValue)}
          subtitle={`${salesOrders.length} confirmed buyer orders`}
          icon={TrendingUp}
          variant="green"
        />

        <StatCard
          title="READY GOODS IN GODOWN"
          value={formatMeters(totalReadyMeters)}
          subtitle="Packaged cloth rolls ready for dispatch"
          icon={Boxes}
          variant="blue"
        />

        <StatCard
          title="AFFILIATED TEXTILE BROKERS"
          value={brokers.length}
          subtitle="Brokers & wholesale buyers"
          icon={Users}
          variant="indigo"
        />
      </div>

      {/* Section 1: Ready Goods Stock */}
      <div className="heavy-card rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider flex items-center gap-2">
            <Boxes className="w-4 h-4 text-sky-600" />
            Ready Goods Inventory (Finished Rolls)
          </h3>
          <span className="text-xs font-mono text-slate-400">Finished Fabric Godown</span>
        </div>

        {/* Add Ready Goods Form */}
        <form onSubmit={handleAddReadyGoods} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">FABRIC VARIETY</label>
            <input
              type="text"
              placeholder="e.g. 70*72 Plain or Cotton 40s"
              value={rgCustomFabric}
              onChange={e => setRgCustomFabric(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">QUANTITY (METERS)</label>
            <input
              type="number"
              placeholder="e.g. 2500"
              value={rgQty}
              onChange={e => setRgQty(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">QUALITY GRADE</label>
            <select
              value={rgQuality}
              onChange={e => setRgQuality(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
            >
              <option>A-Grade (Export)</option>
              <option>B-Grade</option>
              <option>C-Grade (Local)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">RATE (₹/METER)</label>
            <input
              type="number"
              value={rgRate}
              onChange={e => setRgRate(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold text-slate-800"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Stock
            </button>
          </div>
        </form>

        {/* Ready Goods Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-2.5">Fabric Variety</th>
                <th className="pb-2.5">Quantity (m)</th>
                <th className="pb-2.5">Rolls</th>
                <th className="pb-2.5">Quality Grade</th>
                <th className="pb-2.5">Rate (₹/m)</th>
                <th className="pb-2.5">Lot Value (₹)</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {readyGoods.map(g => (
                <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-bold text-slate-900">{g.fabric}</td>
                  <td className="py-3 font-mono font-bold text-emerald-700">{g.qty.toLocaleString()} m</td>
                  <td className="py-3 font-mono text-slate-600">{g.rollCount} rolls</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {g.quality}
                    </span>
                  </td>
                  <td className="py-3 font-mono">₹{g.rate}</td>
                  <td className="py-3 font-mono font-bold text-slate-900">{formatRupees(g.qty * g.rate)}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          const msg = buildReadyGoodsMessage(g);
                          openWhatsAppShare({
                            title: `Ready Goods Lot Slip (${g.fabric})`,
                            message: msg,
                            category: 'sales',
                            defaultPhone: salesWhatsAppPhone || adminWhatsAppPhone
                          });
                        }}
                        className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                        title="Send WhatsApp Ready Goods Slip"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteReadyGoods(g.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete Batch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {readyGoods.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-slate-400">
                    No ready goods rolls in godown yet. Add finished fabric above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Broker Directory & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Brokers Directory */}
        <div className="heavy-card rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Textile Broker & Buyer Directory
            </h3>
            <span className="text-xs font-mono text-slate-400">{brokers.length} Partners</span>
          </div>

          {/* Quick Add Broker Form */}
          <form onSubmit={handleAddBroker} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <input
              type="text"
              placeholder="Broker / Buyer Name"
              value={bName}
              onChange={e => setBName(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={bCompany}
              onChange={e => setBCompany(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <input
              type="text"
              placeholder="City (e.g. Surat)"
              value={bCity}
              onChange={e => setBCity(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <input
              type="tel"
              placeholder="Phone (+91...)"
              value={bPhone}
              onChange={e => setBPhone(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Commission %"
              value={bComm}
              onChange={e => setBComm(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Partner
            </button>
          </form>

          {/* Broker Cards */}
          {brokers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No brokers or buyers registered yet. Add your first broker above.
            </div>
          ) : (
            <div className="space-y-3">
              {brokers.map(b => (
                <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs group">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{b.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {b.type}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {b.company} • {b.city} • Comm: <strong className="text-slate-800">{b.comm}%</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => showToast(`Calling ${b.name} (${b.phone})...`, 'info')}
                      className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors"
                      title="Direct Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const msg = `Namaste ${b.name} ji,\n\nReg: Loom fabric inquiry & current stock from Loomus Textile Mill.\nPlease share your required fabric quality, warp/weft specs & target rate.\n\nRegards,\nLoomus Weaving Mills`;
                        openWhatsApp({ phone: b.phone, message: msg });
                        showToast(`WhatsApp chat opened with broker ${b.name}!`, 'success');
                      }}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg transition-colors"
                      title="Send WhatsApp Message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete broker ${b.name}?`)) deleteBroker(b.id);
                      }}
                      className="p-2 bg-white hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Broker"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Sales Orders */}
        <div className="heavy-card rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 font-display uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Contract Sales Orders
            </h3>
            <span className="text-xs font-mono text-slate-400">{salesOrders.length} Booked</span>
          </div>

          {/* Quick Create Order */}
          <form onSubmit={handleAddOrder} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            {brokers.length > 0 ? (
              <select
                value={soBroker}
                onChange={e => setSoBroker(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                {brokers.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Broker Name"
                value={soBroker}
                onChange={e => setSoBroker(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            )}
            <input
              type="text"
              placeholder="Buyer Name"
              value={soBuyer}
              onChange={e => setSoBuyer(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <input
              type="number"
              placeholder="Meters (e.g. 5000)"
              value={soQty}
              onChange={e => setSoQty(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <input
              type="number"
              placeholder="Rate (₹/m)"
              value={soRate}
              onChange={e => setSoRate(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <input
              type="date"
              value={soDelivery}
              onChange={e => setSoDelivery(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Book Order
            </button>
          </form>

          {/* Orders Table */}
          {salesOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No sales orders booked yet. Create your first contract order above.
            </div>
          ) : (
            <div className="space-y-3">
              {salesOrders.map(o => (
                <div key={o.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs group">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {o.id}
                      </span>
                      <span className="font-bold text-slate-800">{o.buyer}</span>
                      <span className="text-[11px] text-slate-500">via {o.broker}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">
                      {o.fabric} • <strong>{o.qty.toLocaleString()}m @ ₹{o.rate}</strong> • Delivery: {o.deliveryDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono text-sm block">
                        {formatRupees(o.total)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                        Adv: {formatRupees(o.advance)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const msg = buildSalesOrderMessage(o);
                        openWhatsAppShare({
                          title: `Sales Order Slip ${o.id} (Maal Gaya)`,
                          message: msg,
                          category: 'sales',
                          defaultPhone: adminWhatsAppPhone
                        });
                      }}
                      className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                      title="Send WhatsApp Order Slip (Maal Gaya)"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete order ${o.id}?`)) deleteSalesOrder(o.id);
                      }}
                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
