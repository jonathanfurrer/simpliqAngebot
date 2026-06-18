import type { CalculatorInputs, Category, LineItem, PricingTier, QuoteResult, ServiceDefinition } from '@/types/pricing'

const quantityByService: Record<string, keyof CalculatorInputs> = {
  managed_microsoft_tenant: 'tenantCount', managed_entra_id: 'entraMemberAccounts', managed_m365_user: 'm365LicensedUsers',
  managed_entra_admin_access: 'adminAccounts', managed_windows_11_client: 'windowsClients', managed_macos_client: 'macClients',
  managed_windows_365_cloud_pc: 'cloudPCs', managed_azure_landing_zone: 'azureLandingZones', managed_azure_vm: 'azureVMs',
  managed_avd_environment: 'avdEnvironments', managed_avd_session_host: 'avdSessionHosts', managed_avd_concurrent_user: 'avdConcurrentUsers',
  managed_network_site: 'networkSites', managed_vpn_tunnel: 'vpnTunnels', managed_guest_wifi: 'guestWifiSites',
  managed_public_wifi: 'publicWifiSites', maintenance_budget_custom_app: 'customApps', budget_custom_monitoring: 'customMonitoringItems'
}
const avdIds = new Set(['managed_avd_environment', 'managed_avd_session_host', 'managed_avd_concurrent_user'])

function graduated(quantity: number, tiers: PricingTier[], key: 'vp' | 'ep') {
  return tiers.reduce((sum, tier) => {
    const upper = tier.to ?? quantity
    const units = Math.max(0, Math.min(quantity, upper) - tier.from + 1)
    return sum + units * tier[key]
  }, 0)
}

export function calculateQuote(inputs: CalculatorInputs, catalog: ServiceDefinition[]): QuoteResult {
  const lineItems: LineItem[] = []
  for (const service of catalog) {
    if (!inputs.includeTenantManagement && service.id === 'managed_microsoft_tenant') continue
    if ((!inputs.includeVDI && avdIds.has(service.id)) || (!inputs.includeCustomApps && service.id === 'maintenance_budget_custom_app')) continue
    const raw = inputs[quantityByService[service.id]]
    const quantity = typeof raw === 'number' ? Math.max(0, raw) : 0
    if (!quantity) continue
    let billableQuantity = quantity
    let unitPrice = service.vp ?? 0
    let internalUnitCost = service.ep ?? 0
    let monthly = quantity * unitPrice
    let internalCost = quantity * internalUnitCost
    if (service.billingModel === 'volume_tier_total_quantity') {
      const tier = service.tiers?.find(t => quantity >= t.from && (t.to === null || quantity <= t.to))
      unitPrice = tier?.vp ?? 0; internalUnitCost = tier?.ep ?? 0
      monthly = quantity * unitPrice; internalCost = quantity * internalUnitCost
    } else if (service.billingModel === 'graduated_tier') {
      monthly = graduated(quantity, service.tiers ?? [], 'vp')
      internalCost = graduated(quantity, service.tiers ?? [], 'ep')
      unitPrice = monthly / quantity; internalUnitCost = internalCost / quantity
    } else if (service.billingModel === 'hours_per_app') {
      billableQuantity = quantity * inputs.customAppMaintenanceHoursPerMonth
      unitPrice = inputs.hourlyRate
      internalUnitCost = service.ep ?? 0
      monthly = billableQuantity * unitPrice; internalCost = billableQuantity * internalUnitCost
    }
    lineItems.push({
      serviceId: service.id, serviceName: service.name, category: service.category, quantity: billableQuantity, unit: service.unit,
      unitPrice, internalUnitCost, monthly, yearly: monthly * 12, setup: service.setup ?? 0, internalCost,
      grossMargin: monthly - internalCost, grossMarginPercent: monthly ? ((monthly - internalCost) / monthly) * 100 : 0,
      notes: service.billingModel === 'graduated_tier' ? ['Staffelpreis'] : service.billingModel === 'volume_tier_total_quantity' ? ['Volumenpreis'] : undefined
    })
  }
  const monthlySubtotal = lineItems.reduce((s, i) => s + i.monthly, 0)
  const discountAmount = monthlySubtotal * Math.min(100, Math.max(0, inputs.discountPercent)) / 100
  const monthlyTotal = monthlySubtotal - discountAmount
  const monthlyInternalCost = lineItems.reduce((s, i) => s + i.internalCost, 0)
  const grossMargin = monthlyTotal - monthlyInternalCost
  const grossMarginPercent = monthlyTotal ? grossMargin / monthlyTotal * 100 : 0
  const categoryTotals = lineItems.reduce<Partial<Record<Category, number>>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.monthly * (monthlySubtotal ? monthlyTotal / monthlySubtotal : 1); return acc
  }, {})
  const warnings: string[] = []
  const accountDifference = inputs.entraMemberAccounts - inputs.m365LicensedUsers
  if (accountDifference > 0) warnings.push(`${accountDifference} Entra-ID-Accounts sind nicht als M365-User enthalten.`)
  if (inputs.includeSOC && !inputs.m365LicensedUsers && !inputs.entraMemberAccounts) warnings.push('SOC aktiv, aber kein User- oder Identity-Package vorhanden.')
  if (inputs.includeVDI && !inputs.avdEnvironments) warnings.push('VDI aktiv, aber kein AVD Environment gesetzt.')
  if (inputs.includeVDI && !inputs.avdConcurrentUsers) warnings.push('VDI aktiv, aber keine Concurrent User gesetzt.')
  if (inputs.includeCustomApps && (!inputs.customApps || !inputs.customAppMaintenanceHoursPerMonth)) warnings.push('Custom Apps aktiv, aber kein Maintenance Budget gesetzt.')
  if (monthlyTotal && grossMarginPercent < inputs.marginTargetPercent) warnings.push(`Marge unter Zielwert von ${inputs.marginTargetPercent} %.`)
  if (inputs.entraMemberAccounts && inputs.adminAccounts > inputs.entraMemberAccounts * .1) warnings.push('Mehr Admin Accounts als 10 % der User — bitte prüfen.')
  if (!inputs.tenantCount) warnings.push('Keine Tenants gesetzt; tenantbasierte Services sind inaktiv.')
  if (inputs.includeVDI && inputs.includeCustomApps) warnings.push('Custom Apps mit VDI-Abhängigkeit.')
  return { lineItems, monthlySubtotal, discountAmount, monthlyTotal, yearlyTotal: monthlyTotal * 12,
    setupTotal: lineItems.reduce((s, i) => s + i.setup, 0), monthlyInternalCost, grossMargin, grossMarginPercent, categoryTotals, warnings }
}
