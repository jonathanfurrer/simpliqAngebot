'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Sparkles } from 'lucide-react'
import catalogJson from '@/data/pricing-catalog.json'
import { calculateQuote } from '@/lib/pricing'
import { defaults, presets } from '@/lib/presets'
import type { CalculatorInputs, PricingCatalog } from '@/types/pricing'
import { InputPanel } from './InputPanel'
import { SummaryCards } from './SummaryCards'
import { ScenarioSelector } from './ScenarioSelector'
import { CategoryCostChart } from './CategoryCostChart'
import { LineItemsTable } from './LineItemsTable'
import { ExportButtons } from './ExportButtons'

const catalog = catalogJson as unknown as PricingCatalog

export function PricingCalculatorPage() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaults)
  const [activePreset, setActivePreset] = useState('Modern Workplace')
  const quote = useMemo(() => calculateQuote(inputs, catalog.services), [inputs])
  const update = (patch: Partial<CalculatorInputs>) => { setInputs(current => ({ ...current, ...patch })); setActivePreset('') }
  const selectPreset = (name: string) => { setInputs({ ...defaults, ...presets[name] }); setActivePreset(name) }

  return <main className="min-h-screen">
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-lime"><Sparkles className="h-5 w-5" /></div><div><div className="text-lg font-black tracking-tight">simpliq</div><div className="text-xs text-muted">Managed Services · Offertenstudio</div></div></div>
        <ExportButtons inputs={inputs} quote={quote} />
      </div>
    </header>
    <div className="mx-auto grid max-w-[1600px] gap-5 p-4 sm:p-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <InputPanel inputs={inputs} onChange={update} />
      <div className="min-w-0 space-y-5">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><p className="label text-brand">Live-Kalkulation</p><h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Offerte für {inputs.customerName}</h1><p className="mt-2 text-sm text-muted">Preise exkl. MWST · Alle Werte aktualisieren sich live.</p></div><ScenarioSelector active={activePreset} onSelect={selectPreset} /></div>
        <SummaryCards quote={quote} currency={inputs.currency} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)]">
          <CategoryCostChart quote={quote} currency={inputs.currency} />
          <section className="card p-5"><p className="label">Plausibilitätscheck</p><h2 className="mt-1 text-xl font-bold">Hinweise & Annahmen</h2>
            <div className="mt-4 space-y-3">{quote.warnings.length ? quote.warnings.map(w => <div key={w} className="flex gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-950"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span>{w}</span></div>) : <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">Keine Auffälligkeiten erkannt. Die Offerte erfüllt die hinterlegten Regeln.</div>}</div>
            <div className="mt-5 border-t border-black/5 pt-4 text-sm text-muted"><div className="flex justify-between py-1"><span>Listenpreis</span><strong className="text-ink">{inputs.currency} {quote.monthlySubtotal.toLocaleString('de-CH')}</strong></div><div className="flex justify-between py-1"><span>Rabatt</span><strong className="text-ink">− {inputs.currency} {quote.discountAmount.toLocaleString('de-CH')}</strong></div><div className="flex justify-between py-1"><span>Interne Kosten</span><strong className="text-ink">{inputs.currency} {quote.monthlyInternalCost.toLocaleString('de-CH')}</strong></div></div>
          </section>
        </div>
        <LineItemsTable items={quote.lineItems} currency={inputs.currency} />
        <footer className="py-3 text-center text-xs text-muted">Interner Richtpreis-Kalkulator · Werte vor Kundenfreigabe prüfen</footer>
      </div>
    </div>
  </main>
}
