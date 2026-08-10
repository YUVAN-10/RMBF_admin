export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "₹0";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}
