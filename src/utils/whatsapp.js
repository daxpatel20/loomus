// WhatsApp Communication & Business Notification Utility for Loomus Textile Suite
import { formatRupees, formatMeters } from './formatters';

/**
 * Clean and format Indian phone number for wa.me API
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  // If 10 digits (India mobile standard), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // If already starts with 91 and has 12 digits
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
}

/**
 * Opens WhatsApp Web or WhatsApp Mobile App with prefilled message
 */
export function openWhatsApp({ phone, message }) {
  const clean = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  
  let url = '';
  if (clean) {
    url = `https://wa.me/${clean}?text=${encodedText}`;
  } else {
    // Allows user to pick any contact or group
    url = `https://api.whatsapp.com/send?text=${encodedText}`;
  }
  
  window.open(url, '_blank');
}

/**
 * 1. Raw Yarn Inward Message (Maal Aaya)
 */
export function buildYarnInwardMessage(yarn) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const qty = yarn.qty || yarn.current || 0;
  const rate = yarn.rate || 0;
  const total = qty * rate;

  return `🏭 *LOOMUS TEXTILE MILL — MAAL AAYA (RAW YARN INWARD)*
----------------------------------------
📦 *Material / Yarn:* ${yarn.material || yarn.name}
⚖️ *Quantity Received:* ${qty.toLocaleString()} kg
🏭 *Supplier / Mill:* ${yarn.supplier || 'Local Supplier'}
💰 *Purchase Rate:* ₹${rate} / kg
💵 *Total Lot Amount:* ${formatRupees(total)}
🧾 *Challan / Bill No:* ${yarn.invoice || yarn.id || 'N/A'}
📅 *Date & Time:* ${yarn.date || today} at ${time}
----------------------------------------
✅ *Status:* Stock verified & added into Mill Godown.
🏢 *Surat Central Textile Mill*`;
}

/**
 * 2. Sales Order / Cloth Dispatch Message (Maal Gaya)
 */
export function buildSalesOrderMessage(order) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const qty = order.qty || 0;
  const rate = order.rate || 0;
  const total = order.total || (qty * rate);
  const advance = order.advance || 0;
  const balance = total - advance;

  return `🏷️ *LOOMUS TEXTILE MILL — MAAL GAYA (SALES BOOKING / DISPATCH)*
----------------------------------------
🔖 *Order No:* ${order.id}
👔 *Buyer Party:* ${order.buyer}
🤝 *Market Broker:* ${order.broker || 'Direct Sale'}
🧵 *Fabric Variety:* ${order.fabric}
📏 *Quantity (Meters):* ${qty.toLocaleString()} m
💵 *Rate:* ₹${rate} / meter
💰 *Total Bill Value:* ${formatRupees(total)}
💳 *Advance Received:* ${formatRupees(advance)}
📌 *Balance Remaining:* ${formatRupees(balance)}
🚚 *Delivery Date:* ${order.deliveryDate || today}
----------------------------------------
✅ *Status:* ${order.status || 'In Production / Ready'}
🏢 *Surat Commercial Textile Hub*`;
}

/**
 * 3. Ready Goods Dispatch Message
 */
export function buildReadyGoodsMessage(item) {
  const totalVal = (item.qty || 0) * (item.rate || 0);

  return `📦 *LOOMUS TEXTILE MILL — READY GOODS STOCK SLIP*
----------------------------------------
🧵 *Fabric Quality:* ${item.fabric}
📏 *Available Quantity:* ${(item.qty || 0).toLocaleString()} meters
📦 *Total Rolls:* ${item.rollCount || 1} packaged rolls
⭐ *Grade:* ${item.quality || 'A-Grade (Export)'}
💵 *Wholesale Rate:* ₹${item.rate || 0} / meter
💰 *Total Lot Value:* ${formatRupees(totalVal)}
📍 *Location:* ${item.location || 'Warehouse Rack'}
----------------------------------------
📲 Immediate delivery available from Surat Godown.`;
}

/**
 * 4. Worker Shift & Loom Assignment Duty Slip
 */
export function buildWorkerDutySlipMessage(worker) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return `👷‍♂️ *LOOMUS TEXTILE MILL — WORKER DUTY & LOOM ASSIGNMENT*
----------------------------------------
👤 *Staff Name:* ${worker.name} (ID: ${worker.id})
🛠️ *Role / Designation:* ${worker.role}
⚙️ *Assigned Looms:* ${worker.machine}
🕒 *Shift Timing:* ${worker.shift}
🏢 *Factory Shed:* ${worker.shed || 'Main Shed'}
📅 *Duty Date:* ${today}
----------------------------------------
⚠️ Kripya shift start hone se 10 min pehle report karein aur loom safety inspection complete karein.
🏢 *Surat Central Weaving Mill*`;
}

/**
 * 5. Full Shift Staff Attendance Summary
 */
export function buildAttendanceSummaryMessage(workers) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const active = workers.filter(w => w.status === 'active').length;
  const onBreak = workers.filter(w => w.status === 'break').length;
  const absent = workers.filter(w => w.status === 'absent').length;

  return `📋 *LOOMUS TEXTILE MILL — SHIFT ATTENDANCE SUMMARY*
----------------------------------------
👥 *Total Enrolled Staff:* ${workers.length} members
🟢 *Active on Looms:* ${active} staff
🟡 *On Scheduled Break:* ${onBreak} staff
🔴 *Absent / Off-Shift:* ${absent} staff
📅 *Shift Date:* ${today}
----------------------------------------
🏢 *Supervisor Floor Attendance Roster*`;
}

/**
 * 6. Daily Executive Plant Report to Admin (Full Factory Summary)
 */
export function buildDailyAdminExecutiveReport({ machines = [], productionLogs = [], salesOrders = [], stockLevels = [], alarms = [] }) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const runningCount = machines.filter(m => m.status === 'running').length;
  const totalMeters = machines.reduce((acc, m) => acc + (m.output || 0), 0);
  const avgEfficiency = runningCount > 0
    ? Math.round(machines.filter(m => m.status === 'running').reduce((acc, m) => acc + (m.efficiency || 0), 0) / runningCount)
    : 0;

  const totalYarnKg = stockLevels.reduce((acc, s) => acc + (s.current || 0), 0);
  const yarnValuation = stockLevels.reduce((acc, s) => acc + ((s.current || 0) * (s.rate || 0)), 0);

  const totalSalesVal = salesOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const criticalAlarms = alarms.filter(a => a.type === 'critical').length;

  return `📊 *LOOMUS TEXTILE MILL — DAILY EXECUTIVE REPORT (FOR ADMIN)*
📅 *Date:* ${today} | ⏰ *Time:* ${time}
========================================

🏭 *1. PLANT WEAVING TELEMETRY:*
• Active Looms: *${runningCount} / ${machines.length} units running*
• Total Shift Weaving Output: *${totalMeters.toLocaleString()} meters*
• Fleet Average Efficiency: *${avgEfficiency}%*

📦 *2. RAW YARN INWARD & GODOWN (MAAL AAYA):*
• Yarn in Stock: *${totalYarnKg.toLocaleString()} kg*
• Current Stock Valuation: *${formatRupees(yarnValuation)}*

💼 *3. SALES & COMMERCIAL ORDERS (MAAL GAYA):*
• Orders Booked Today: *${salesOrders.length} contracts*
• Total Order Value: *${formatRupees(totalSalesVal)}*

🚨 *4. SAFETY & QUALITY AUDIT:*
• Critical Machine Trips: *${criticalAlarms} breakages*
• Active Safety Alerts: *${alarms.length} notices*

========================================
🚀 *Loomus 2.0 Smart Textile Suite — Auto-Generated Report*`;
}

