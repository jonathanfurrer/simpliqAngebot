'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/formatCurrency'
import type { QuoteResult } from '@/types/pricing'

const colors = ['#1c6b4a', '#63a46c', '#c9f25f', '#17211b', '#f0a04b', '#756ab6']

export function CategoryCostChart({ quote, currency }: { quote: QuoteResult; currency: string }) {
  const data = Object.entries(quote.categoryTotals).map(([name, value]) => ({ name: name.replace('Identity & Access Management', 'Identity & Access'), value: Number(value ?? 0) }))
  return <div className="card p-5"><div className="mb-2"><p className="label">Kostenstruktur</p><h2 className="mt-1 text-xl font-bold">Monatlich nach Kategorie</h2></div>
    <div className="grid items-center md:grid-cols-[1fr_1fr]">
      <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={3} stroke="none">{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip formatter={value => formatCurrency(Number(value), currency)} /></PieChart></ResponsiveContainer></div>
      <div className="space-y-3">{data.map((item, i) => <div className="flex items-center justify-between gap-4 text-sm" key={item.name}><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i % colors.length] }} />{item.name}</span><strong>{formatCurrency(item.value, currency)}</strong></div>)}</div>
    </div>
  </div>
}
