import { presets } from '@/lib/presets'

export function ScenarioSelector({ active, onSelect }: { active: string; onSelect: (name: string) => void }) {
  return <div className="flex gap-2 overflow-x-auto pb-1">{Object.keys(presets).map(name => <button key={name} onClick={() => onSelect(name)}
    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${active === name ? 'bg-ink text-white' : 'border border-black/10 bg-white hover:border-brand'}`}>{name}</button>)}</div>
}
