// Utility formatters for LOOMUS Textile Suite

export function formatRupees(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatMeters(meters) {
  const m = parseFloat(meters) || 0;
  return m.toLocaleString('en-IN') + ' m';
}

export function formatPercentage(val) {
  return `${Math.round(val)}%`;
}

