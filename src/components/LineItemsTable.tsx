import { formatCurrency } from '@/lib/formatCurrency'
import type { LineItem } from '@/types/pricing'

export function LineItemsTable({ items, currency }: { items: LineItem[]; currency: string }) {
  return <div className="card overflow-hidden">
    <div className="border-b border-black/5 p-5"><p className="label">Offerte</p><h2 className="mt-1 text-xl font-bold">Leistungspositionen</h2></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm">
      <thead className="bg-paper text-xs uppercase tracking-wider text-muted"><tr>
        <th className="px-5 py-3">Service</th><th className="px-3 py-3">Kategorie</th><th className="px-3 py-3 text-right">Menge</th>
        <th className="px-3 py-3 text-right">EP</th><th className="px-3 py-3 text-right">VP</th><th className="px-3 py-3 text-right">Monatlich</th>
        <th className="px-3 py-3 text-right">Jährlich</th><th className="px-5 py-3 text-right">Setup</th>
      </tr></thead>
      <tbody className="divide-y divide-black/5">{items.map(item => <tr key={item.serviceId} className="hover:bg-paper/60">
        <td className="px-5 py-4"><div className="font-semibold">{item.serviceName}</div><div className="mt-1 text-xs text-muted">pro {item.unit}{item.notes?.length ? ` · ${item.notes.join(', ')}` : ''}</div></td>
        <td className="px-3 py-4 text-muted">{item.category}</td><td className="px-3 py-4 text-right font-medium">{item.quantity}</td>
        <td className="px-3 py-4 text-right text-muted">{formatCurrency(item.internalUnitCost, currency)}</td><td className="px-3 py-4 text-right">{formatCurrency(item.unitPrice, currency)}</td>
        <td className="px-3 py-4 text-right font-bold">{formatCurrency(item.monthly, currency)}</td><td className="px-3 py-4 text-right">{formatCurrency(item.yearly, currency)}</td>
        <td className="px-5 py-4 text-right">{formatCurrency(item.setup, currency)}</td>
      </tr>)}</tbody>
    </table></div>
  </div>
}
