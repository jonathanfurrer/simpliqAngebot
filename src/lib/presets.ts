import type { CalculatorInputs } from '@/types/pricing'

export const defaults: CalculatorInputs = {
  customerName: 'Musterkunde AG', tenantCount: 1, includeTenantManagement: true, currency: 'CHF', entraMemberAccounts: 80,
  entraP1OnlyUsers: 10, m365LicensedUsers: 70, sharedMailboxes: 10, teamsRooms: 0, adminAccounts: 3, windowsClients: 65,
  macClients: 8, cloudPCs: 0, kioskDevices: 0, azureLandingZones: 1, azureVMs: 3, avdEnvironments: 0,
  avdSessionHosts: 0, avdConcurrentUsers: 0, networkSites: 3, vpnTunnels: 1, isolatedNetworks: 0, guestWifiSites: 3,
  publicWifiSites: 0, customApps: 2, customAppMaintenanceHoursPerMonth: 5, customMonitoringItems: 0, hourlyRate: 160,
  includeSOC: true, includeBackup: true, includeSecurityAwareness: true, includeVDI: false, includeCustomApps: false,
  discountPercent: 0, marginTargetPercent: 35
}

export const presets: Record<string, Partial<CalculatorInputs>> = {
  'Basic Tenant': { entraMemberAccounts: 25, m365LicensedUsers: 0, windowsClients: 0, macClients: 0, azureLandingZones: 0, azureVMs: 0, networkSites: 0, guestWifiSites: 0 },
  'Secure Identity': { entraMemberAccounts: 80, m365LicensedUsers: 0, adminAccounts: 4, windowsClients: 0, macClients: 0, includeSOC: true, azureLandingZones: 0, azureVMs: 0 },
  'Modern Workplace': { entraMemberAccounts: 80, m365LicensedUsers: 75, windowsClients: 65, macClients: 10, includeVDI: false, azureLandingZones: 0, azureVMs: 0 },
  'Cloud / VDI': { entraMemberAccounts: 60, m365LicensedUsers: 50, windowsClients: 10, includeVDI: true, azureLandingZones: 1, azureVMs: 4, avdEnvironments: 1, avdSessionHosts: 3, avdConcurrentUsers: 35 },
  'Full Managed': { ...defaults, includeVDI: true, avdEnvironments: 1, avdSessionHosts: 2, avdConcurrentUsers: 12, includeCustomApps: true }
}
