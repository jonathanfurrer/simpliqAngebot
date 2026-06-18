'use client'

import { Braces, FileText } from 'lucide-react'
import { formatCurrency } from '@/lib/formatCurrency'
import type { CalculatorInputs, QuoteResult } from '@/types/pricing'

function download(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url)
}

export function ExportButtons({ inputs, quote }: { inputs: CalculatorInputs; quote: QuoteResult }) {
  const safeName = inputs.customerName.toLowerCase().replace(/[^a-z0-9äöü]+/gi, '-')
  const json = () => download(JSON.stringify({ generatedAt: new Date().toISOString(), inputs, quote }, null, 2), `offerte-${safeName}.json`, 'application/json')
  const markdown = () => {
    const rows = quote.lineItems.map(i => `| ${i.serviceName} | ${i.quantity} ${i.unit} | ${formatCurrency(i.unitPrice, inputs.currency)} | ${formatCurrency(i.monthly, inputs.currency)} |`).join('\n')
    const md = `# Offertenübersicht – ${inputs.customerName}\n\n## Zusammenfassung\n\n- Monatlich wiederkehrend: ${formatCurrency(quote.monthlyTotal, inputs.currency)}\n- Jährlich wiederkehrend: ${formatCurrency(quote.yearlyTotal, inputs.currency)}\n- Einmaliges Setup: ${formatCurrency(quote.setupTotal, inputs.currency)}\n- Geschätzte Marge: ${quote.grossMarginPercent.toFixed(1)} %\n\n## Positionen\n\n| Position | Menge | Einzelpreis | Monatlich |\n|---|---:|---:|---:|\n${rows}\n\n## Hinweise\n\n${quote.warnings.map(w => `- ${w}`).join('\n') || '- Keine Hinweise'}\n`
    download(md, `offerte-${safeName}.md`, 'text/markdown')
  }
  return <div className="flex gap-2"><button onClick={json} className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:border-brand"><Braces className="h-4 w-4" /> JSON</button><button onClick={markdown} className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-ink"><FileText className="h-4 w-4" /> Markdown</button></div>
}
