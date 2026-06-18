import { AlertTriangle, CalendarDays, Coins, Gauge, Repeat2 } from 'lucide-react'
import { formatCurrency } from '@/lib/formatCurrency'
import type { QuoteResult } from '@/types/pricing'

export function SummaryCards({ quote, currency }: { quote: QuoteResult; currency: string }) {
  const cards = [
    { label: 'Monatlich', value: formatCurrency(quote.monthlyTotal, currency), icon: Repeat2 },
    { label: 'Jährlich', value: formatCurrency(quote.yearlyTotal, currency), icon: CalendarDays },
    { label: 'Setup einmalig', value: formatCurrency(quote.setupTotal, currency), icon: Coins },
    { label: 'Geschätzte Marge', value: `${quote.grossMarginPercent.toFixed(1)} %`, icon: Gauge }
  ]
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
    {cards.map(({ label, value, icon: Icon }) => <div className="card p-4" key={label}><div className="flex items-center justify-between"><span className="label">{label}</span><Icon className="h-4 w-4 text-brand" /></div><p className="mt-4 text-2xl font-bold tracking-tight">{value}</p></div>)}
    <div className={`card p-4 ${quote.warnings.length ? 'bg-amber-50' : 'bg-brand text-white'}`}>
      <div className="flex items-center justify-between"><span className={`label ${quote.warnings.length ? '' : 'text-white/65'}`}>Status</span><AlertTriangle className={`h-4 w-4 ${quote.warnings.length ? 'text-amber-600' : 'text-lime'}`} /></div>
      <p className="mt-4 text-lg font-bold">{quote.warnings.length ? `${quote.warnings.length} Hinweise` : 'Alles im grünen Bereich'}</p>
    </div>
  </div>
}
