'use client'

import * as Switch from '@radix-ui/react-switch'
import type { CalculatorInputs } from '@/types/pricing'

type Props = { inputs: CalculatorInputs; onChange: (patch: Partial<CalculatorInputs>) => void }
type NumberKey = { key: keyof CalculatorInputs; label: string }

const groups: { title: string; fields: NumberKey[] }[] = [
  { title: 'Identity & Collaboration', fields: [
    { key: 'tenantCount', label: 'Microsoft Tenants' }, { key: 'entraMemberAccounts', label: 'Entra-ID Accounts' },
    { key: 'm365LicensedUsers', label: 'M365 User' }, { key: 'adminAccounts', label: 'Admin Accounts' }
  ]},
  { title: 'Endpoints', fields: [
    { key: 'windowsClients', label: 'Windows Clients' }, { key: 'macClients', label: 'macOS Clients' },
    { key: 'cloudPCs', label: 'Cloud PCs' }, { key: 'kioskDevices', label: 'Kiosk Devices' }
  ]},
  { title: 'Cloud & VDI', fields: [
    { key: 'azureLandingZones', label: 'Azure Landing Zones' }, { key: 'azureVMs', label: 'Azure VMs' },
    { key: 'avdEnvironments', label: 'AVD Environments' }, { key: 'avdSessionHosts', label: 'AVD Session Hosts' },
    { key: 'avdConcurrentUsers', label: 'AVD Concurrent User' }
  ]},
  { title: 'Network', fields: [
    { key: 'networkSites', label: 'Network Sites' }, { key: 'vpnTunnels', label: 'VPN Tunnels' },
    { key: 'guestWifiSites', label: 'Guest WiFi Sites' }, { key: 'publicWifiSites', label: 'Public WiFi Sites' },
    { key: 'customMonitoringItems', label: 'Custom Monitoring' }
  ]},
  { title: 'Custom Apps', fields: [
    { key: 'customApps', label: 'Custom Apps' }, { key: 'customAppMaintenanceHoursPerMonth', label: 'Stunden / App' },
    { key: 'hourlyRate', label: 'Stundensatz' }
  ]}
]

function Toggle({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 py-1.5 text-sm font-medium">
    {label}<Switch.Root checked={checked} onCheckedChange={onCheckedChange} className="relative h-6 w-11 rounded-full bg-black/15 transition data-[state=checked]:bg-brand">
      <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
    </Switch.Root>
  </label>
}

export function InputPanel({ inputs, onChange }: Props) {
  return <aside className="card overflow-hidden lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:overflow-y-auto">
    <div className="border-b border-black/5 bg-ink p-5 text-white">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-lime">Konfiguration</p>
      <input value={inputs.customerName} onChange={e => onChange({ customerName: e.target.value })} aria-label="Kundenname"
        className="mt-3 w-full border-0 border-b border-white/20 bg-transparent pb-2 text-xl font-semibold outline-none focus:border-lime" />
    </div>
    <div className="space-y-6 p-5">
      <div className="space-y-1">
        <Toggle label="Tenant Management" checked={inputs.includeTenantManagement} onCheckedChange={v => onChange({ includeTenantManagement: v })} />
        <Toggle label="SOC" checked={inputs.includeSOC} onCheckedChange={v => onChange({ includeSOC: v })} />
        <Toggle label="VDI / AVD" checked={inputs.includeVDI} onCheckedChange={v => onChange({ includeVDI: v })} />
        <Toggle label="Custom Apps" checked={inputs.includeCustomApps} onCheckedChange={v => onChange({ includeCustomApps: v })} />
      </div>
      {groups.map(group => {
        if (group.title === 'Cloud & VDI' && !inputs.includeVDI) group = { ...group, fields: group.fields.slice(0, 2) }
        if (group.title === 'Custom Apps' && !inputs.includeCustomApps) return null
        return <section key={group.title}>
          <h3 className="label mb-2">{group.title}</h3>
          <div className="divide-y divide-black/5">{group.fields.map(field => <label key={field.key} className="flex items-center justify-between gap-4 py-2 text-sm">
            <span>{field.label}</span><input className="number-input" type="number" min="0" value={inputs[field.key] as number}
              onChange={e => onChange({ [field.key]: Math.max(0, Number(e.target.value)) })} />
          </label>)}</div>
        </section>
      })}
      <section>
        <h3 className="label mb-2">Konditionen</h3>
        <label className="flex items-center justify-between py-2 text-sm"><span>Rabatt %</span><input className="number-input" type="number" min="0" max="100" value={inputs.discountPercent} onChange={e => onChange({ discountPercent: Number(e.target.value) })} /></label>
        <label className="flex items-center justify-between py-2 text-sm"><span>Zielmarge %</span><input className="number-input" type="number" min="0" max="100" value={inputs.marginTargetPercent} onChange={e => onChange({ marginTargetPercent: Number(e.target.value) })} /></label>
      </section>
    </div>
  </aside>
}
