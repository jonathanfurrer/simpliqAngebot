export function formatCurrency(value: number, currency = 'CHF') {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}
