export type BillingModel = 'flat_per_unit' | 'volume_tier_total_quantity' | 'graduated_tier' | 'hours_per_app'
export type Category = 'Identity & Access Management' | 'Collaboration' | 'Endpoint' | 'Cloud Infrastructure' | 'Network' | 'Custom Apps'

export interface PricingTier { from: number; to: number | null; vp: number; ep: number }
export interface ServiceDefinition {
  id: string; name: string; category: Category; unit: string; billingModel: BillingModel
  vp?: number; ep?: number; tiers?: PricingTier[]; setup?: number
}
export interface PricingCatalog { currency: string; services: ServiceDefinition[] }

export interface CalculatorInputs {
  customerName: string; tenantCount: number; includeTenantManagement: boolean; currency: 'CHF' | 'EUR'
  entraMemberAccounts: number; entraP1OnlyUsers: number; m365LicensedUsers: number; sharedMailboxes: number; teamsRooms: number
  adminAccounts: number; windowsClients: number; macClients: number; cloudPCs: number; kioskDevices: number
  azureLandingZones: number; azureVMs: number; avdEnvironments: number; avdSessionHosts: number; avdConcurrentUsers: number
  networkSites: number; vpnTunnels: number; isolatedNetworks: number; guestWifiSites: number; publicWifiSites: number
  customApps: number; customAppMaintenanceHoursPerMonth: number; customMonitoringItems: number; hourlyRate: number
  includeSOC: boolean; includeBackup: boolean; includeSecurityAwareness: boolean; includeVDI: boolean; includeCustomApps: boolean
  discountPercent: number; marginTargetPercent: number
}
export interface LineItem {
  serviceId: string; serviceName: string; category: Category; quantity: number; unit: string
  unitPrice: number; internalUnitCost: number; monthly: number; yearly: number; setup: number
  internalCost: number; grossMargin: number; grossMarginPercent: number; notes?: string[]
}
export interface QuoteResult {
  lineItems: LineItem[]; monthlySubtotal: number; discountAmount: number; monthlyTotal: number; yearlyTotal: number
  setupTotal: number; monthlyInternalCost: number; grossMargin: number; grossMarginPercent: number
  categoryTotals: Partial<Record<Category, number>>; warnings: string[]
}
