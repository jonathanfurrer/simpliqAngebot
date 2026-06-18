# Beschrieb für WebApp: Dynamischer Managed-Service-Offertenrechner

## Ziel

Es soll eine WebApp entstehen, mit der simpliq schnell eine grobe, visuell ansprechende Offertenübersicht für Managed Services erstellen kann. Die App soll nicht als finales ERP/CPQ-System starten, sondern als schneller, interaktiver Kalkulator für Sales, Presales und Projektleitung.

Die App soll vermeiden, dass alle Preise pauschal über “User” gerechnet werden. Stattdessen sollen die Mengen granular eingestellt werden können, z. B. User, M365-User, Entra-ID-Accounts, Geräte, Admins, Sites, VDI/AVD-Komponenten, Azure VMs, Custom Apps und Zusatzoptionen.

## Primäre Use Cases

1. Sales öffnet die WebApp und wählt ein Szenario: Basic, Secure, Modern Workplace, Cloud/VDI oder Custom.
2. Sales gibt Mengen ein: Anzahl User, M365-lizenzierte User, Entra-ID-Accounts, Windows Clients, macOS Clients, Admins, Sites, VMs, Custom Apps usw.
3. Die WebApp berechnet live monatliche und jährliche Kosten.
4. Die WebApp zeigt eine grafische Aufteilung nach Kategorien: Identity, Collaboration, Endpoint, Cloud Infrastructure, Network, Custom Apps.
5. Die WebApp zeigt eine Offerten-Zusammenfassung mit Positionen, Mengen, Einzelpreisen, Monatspreis und Jahrespreis.
6. Die WebApp erlaubt Export als PDF/Markdown/JSON für Weiterverarbeitung.

## Zielgruppe

- Sales
- Presales
- Service Owner
- Geschäftsleitung
- Später eventuell Kundenportal-Light-Version

## Tech-Vorschlag

Für eine erste Version:

- Frontend: Next.js 15 oder React + Vite
- Styling: Tailwind CSS
- UI-Komponenten: shadcn/ui
- Charts: Recharts
- State: Zustand oder React Context
- Datenhaltung V1: lokale JSON-Datei `pricing-catalog.json`
- Datenhaltung V2: Supabase, PostgreSQL oder einfache Admin-Konfiguration
- Export: clientseitiger Markdown/JSON-Export; PDF später via serverseitigem Renderer

## Kernidee der App

Die App besteht aus drei Hauptbereichen:

1. **Input Panel** links  
   Slider, Number Inputs und Toggles für Mengen und Optionen.

2. **Live Summary** rechts oben  
   Monatlich wiederkehrende Kosten, jährlich wiederkehrende Kosten, einmalige Setup-Kosten, geschätzte interne Kosten, Marge.

3. **Visualisierung und Offertenpositionen** rechts/unten  
   Donut-/Bar-Chart nach Kategorien und darunter eine detaillierte Positionsliste.

## Eingabeparameter

### Allgemein

| Feld | Typ | Beschreibung | Default |
|---|---:|---|---:|
| customerName | string | Kundenname | Musterkunde AG |
| tenantCount | number | Anzahl Microsoft Tenants | 1 |
| includeTenantManagement | boolean | Managed Microsoft Tenant aktivieren | true |
| includeSOC | boolean | SOC-Komponenten berücksichtigen | true |
| includeBackup | boolean | Backup für M365-Daten berücksichtigen | true |
| includeSecurityAwareness | boolean | SAT berücksichtigen | true |
| includeVDI | boolean | VDI/AVD-Modul anzeigen | false |
| includeCustomApps | boolean | Custom-App-Budget anzeigen | false |
| currency | enum | CHF/EUR | CHF |
| discountPercent | number | Angebotsrabatt in Prozent | 0 |
| marginTargetPercent | number | Zielmarge für Warnhinweise | 35 |

### Identity & Access

| Feld | Typ | Beschreibung | Default |
|---|---:|---|---:|
| entraMemberAccounts | number | Anzahl Entra ID Member Accounts | 80 |
| adminAccounts | number | Anzahl privilegierte Admin Accounts | 3 |
| entraP1OnlyUsers | number | User mit Entra P1 ohne Mailbox/Intune | 10 |

### Collaboration

| Feld | Typ | Beschreibung | Default |
|---|---:|---|---:|
| m365LicensedUsers | number | Benutzer mit M365-Lizenz und Backup/SAT | 70 |
| sharedMailboxes | number | Shared Mailboxes, optional separat | 10 |
| teamsRooms | number | Teams Rooms, optional später | 0 |

### Endpoint

| Feld | Typ | Beschreibung | Default |
|---|---:|---|---:|
| windowsClients | number | Windows 11 Clients | 65 |
| macClients | number | macOS Clients | 8 |
| cloudPCs | number | Windows 365 Cloud PCs | 0 |
| kioskDevices | number | Kiosk/Shared Devices | 0 |

### Cloud / VDI

| Feld | Typ | Beschreibung | Default |
|---|---:|---|---:|
| azureLandingZones | number | Azure Landing Zones / Tenants | 1 |
| azureVMs | number | Managed Azure VMs | 3 |
| avdEnvironments | number | AVD Environments | 0 |
| avdSessionHosts | number | AVD Session Hosts | 0 |
| avdConcurrentUsers | number | Peak concurrent AVD Users | 0 |

### Network

| Feld | Typ | Beschreibung | Default |
|---|---:|---|---:|
| networkSites | number | Managed Network Sites | 3 |
| vpnTunnels | number | VPN-Tunnel | 1 |
| isolatedNetworks | number | isolierte VLANs | 0 |
| guestWifiSites | number | Guest WiFi Sites | 3 |
| publicWifiSites | number | Public WiFi Sites | 0 |

### Custom Apps und Budgets

| Feld | Typ | Beschreibung | Default |
|---|---:|---|---:|
| customApps | number | Anzahl Custom Apps | 2 |
| customAppMaintenanceHoursPerMonth | number | Unterhaltsbudget pro App und Monat | 5 |
| hourlyRate | number | Stundensatz für Custom Maintenance | 160 |
| customMonitoringItems | number | Custom Monitoring Items | 0 |

## Fantasie-Preiskatalog V1

Alle Preise sind monatlich in CHF, ausser Setup-Kosten.

```json
{
  "currency": "CHF",
  "services": [
    {
      "id": "managed_microsoft_tenant",
      "name": "Managed Microsoft Tenant",
      "category": "Identity & Access Management",
      "unit": "tenant",
      "billingModel": "flat_per_unit",
      "vp": 175,
      "ep": 15.4,
      "setup": 450
    },
    {
      "id": "managed_entra_id",
      "name": "Managed Entra ID",
      "category": "Identity & Access Management",
      "unit": "entraMemberAccount",
      "billingModel": "volume_tier_total_quantity",
      "tiers": [
        { "from": 0, "to": 25, "vp": 15, "ep": 2.16 },
        { "from": 26, "to": 100, "vp": 10, "ep": 2.16 },
        { "from": 101, "to": 250, "vp": 7.5, "ep": 2.16 },
        { "from": 251, "to": null, "vp": 6, "ep": 2.16 }
      ],
      "setup": 250
    },
    {
      "id": "managed_m365_user",
      "name": "Managed Microsoft 365 User",
      "category": "Collaboration",
      "unit": "m365LicensedUser",
      "billingModel": "volume_tier_total_quantity",
      "tiers": [
        { "from": 0, "to": 25, "vp": 25, "ep": 5.49 },
        { "from": 26, "to": 100, "vp": 15, "ep": 5.49 },
        { "from": 101, "to": 250, "vp": 7.5, "ep": 5.49 },
        { "from": 251, "to": null, "vp": 6, "ep": 5.49 }
      ],
      "setup": 250
    },
    {
      "id": "managed_entra_admin_access",
      "name": "Managed Entra ID Admin Access",
      "category": "Identity & Access Management",
      "unit": "adminAccount",
      "billingModel": "flat_per_unit",
      "vp": 45,
      "ep": 8,
      "setup": 150
    },
    {
      "id": "managed_windows_11_client",
      "name": "Managed Windows 11 Client",
      "category": "Endpoint",
      "unit": "windowsClient",
      "billingModel": "volume_tier_total_quantity",
      "tiers": [
        { "from": 0, "to": 25, "vp": 35, "ep": 6.89 },
        { "from": 26, "to": 100, "vp": 25, "ep": 6.89 },
        { "from": 101, "to": null, "vp": 15, "ep": 6.89 }
      ],
      "setup": 80
    },
    {
      "id": "managed_macos_client",
      "name": "Managed macOS Client",
      "category": "Endpoint",
      "unit": "macClient",
      "billingModel": "volume_tier_total_quantity",
      "tiers": [
        { "from": 0, "to": 10, "vp": 45, "ep": 6.89 },
        { "from": 11, "to": 25, "vp": 35, "ep": 6.89 },
        { "from": 26, "to": 100, "vp": 25, "ep": 6.89 },
        { "from": 101, "to": null, "vp": 15, "ep": 6.89 }
      ],
      "setup": 90
    },
    {
      "id": "managed_windows_365_cloud_pc",
      "name": "Managed Windows 365 Cloud PC",
      "category": "Endpoint",
      "unit": "cloudPC",
      "billingModel": "flat_per_unit",
      "vp": 39,
      "ep": 6.89,
      "setup": 120
    },
    {
      "id": "managed_azure_landing_zone",
      "name": "Managed Azure Landing Zone",
      "category": "Cloud Infrastructure",
      "unit": "azureLandingZone",
      "billingModel": "flat_per_unit",
      "vp": 250,
      "ep": 30,
      "setup": 950
    },
    {
      "id": "managed_azure_vm",
      "name": "Managed Azure Virtual Machine",
      "category": "Cloud Infrastructure",
      "unit": "azureVM",
      "billingModel": "flat_per_unit",
      "vp": 45,
      "ep": 8,
      "setup": 120
    },
    {
      "id": "managed_avd_environment",
      "name": "Managed Azure Virtual Desktop Environment",
      "category": "Cloud Infrastructure",
      "unit": "avdEnvironment",
      "billingModel": "flat_per_unit",
      "vp": 250,
      "ep": 25,
      "setup": 750
    },
    {
      "id": "managed_avd_session_host",
      "name": "Managed AVD Session Host",
      "category": "Cloud Infrastructure",
      "unit": "avdSessionHost",
      "billingModel": "flat_per_unit",
      "vp": 65,
      "ep": 10,
      "setup": 150
    },
    {
      "id": "managed_avd_concurrent_user",
      "name": "Managed AVD Concurrent User",
      "category": "Cloud Infrastructure",
      "unit": "avdConcurrentUser",
      "billingModel": "flat_per_unit",
      "vp": 14,
      "ep": 3,
      "setup": 0
    },
    {
      "id": "managed_network_site",
      "name": "Managed Network Site",
      "category": "Network",
      "unit": "networkSite",
      "billingModel": "graduated_tier",
      "tiers": [
        { "from": 1, "to": 5, "vp": 150, "ep": 25 },
        { "from": 6, "to": null, "vp": 50, "ep": 12 }
      ],
      "setup": 300
    },
    {
      "id": "managed_vpn_tunnel",
      "name": "Managed VPN-Tunnel",
      "category": "Network",
      "unit": "vpnTunnel",
      "billingModel": "flat_per_unit",
      "vp": 25,
      "ep": 5,
      "setup": 80
    },
    {
      "id": "managed_guest_wifi",
      "name": "Managed Guest WiFi",
      "category": "Network",
      "unit": "guestWifiSite",
      "billingModel": "flat_per_unit",
      "vp": 45,
      "ep": 8,
      "setup": 120
    },
    {
      "id": "managed_public_wifi",
      "name": "Managed Public WiFi",
      "category": "Network",
      "unit": "publicWifiSite",
      "billingModel": "flat_per_unit",
      "vp": 95,
      "ep": 20,
      "setup": 180
    },
    {
      "id": "maintenance_budget_custom_app",
      "name": "Maintenance Budget Custom App",
      "category": "Custom Apps",
      "unit": "maintenanceHour",
      "billingModel": "hours_per_app",
      "vp": 160,
      "ep": 85,
      "setup": 0
    },
    {
      "id": "budget_custom_monitoring",
      "name": "Budget Custom Monitoring",
      "category": "Network",
      "unit": "customMonitoringItem",
      "billingModel": "flat_per_unit",
      "vp": 150,
      "ep": 25,
      "setup": 100
    }
  ]
}
```

## Preislogik

### 1. Flat per unit

```ts
monthly = quantity * unitPrice
internalCost = quantity * ep
setup = quantity > 0 ? setupPrice : 0
```

Beispiel: 3 Admin Accounts × CHF 45 = CHF 135 / Monat.

### 2. Volume tier total quantity

Der Preis pro Einheit wird anhand der Gesamtmenge gewählt.

```ts
unitPrice = findTier(quantity).vp
monthly = quantity * unitPrice
```

Beispiel: 80 Entra-ID-Accounts fallen in Tier 26–100 → CHF 10 pro Account → CHF 800 / Monat.

### 3. Graduated tier

Mengen werden stufenweise berechnet.

```ts
monthly = firstFive * 150 + remaining * 50
```

Beispiel: 7 Sites → 5 × CHF 150 + 2 × CHF 50 = CHF 850 / Monat.

### 4. Custom-App-Budget

```ts
monthly = customApps * customAppMaintenanceHoursPerMonth * hourlyRate
```

Beispiel: 2 Apps × 5 Stunden × CHF 160 = CHF 1’600 / Monat.

### 5. Rabatt

```ts
subtotal = sum(lineItems.monthly)
discount = subtotal * discountPercent / 100
totalMonthly = subtotal - discount
totalYearly = totalMonthly * 12
```

### 6. Marge

```ts
monthlyInternalCost = sum(lineItems.internalCost)
grossMargin = totalMonthly - monthlyInternalCost
grossMarginPercent = grossMargin / totalMonthly * 100
```

Wenn `grossMarginPercent < marginTargetPercent`, soll die App eine Warnung anzeigen.

## Abhängigkeiten und Validierungen

### Managed Microsoft Tenant

- Wenn `includeSOC = true`, muss mindestens ein User Package oder mindestens ein Identity-Service aktiv sein.
- Falls `tenantCount = 0`, sollen alle Tenant-basierten Services deaktiviert werden.

### Managed Entra ID

- `entraMemberAccounts` darf höher sein als `m365LicensedUsers`.
- Die Differenz soll als Hinweis angezeigt werden: “X Entra-ID-Accounts ohne M365-User-Package”.

### Managed Microsoft 365 User

- Nur für M365-lizenzierte Benutzer mit Mailbox/Collaboration-Daten.
- Backup und Security Awareness können als enthaltene Bestandteile angezeigt oder später separat schaltbar gemacht werden.

### Endpoint Services

- Windows, macOS, Cloud PCs und Kiosk Devices sollen separat erfasst werden.
- Cloud PCs zählen nicht automatisch als physische Windows Clients, ausser explizit aktiviert.

### VDI / AVD

- Wenn `includeVDI = false`, werden AVD Environment, Session Hosts und Concurrent Users ausgeblendet und nicht berechnet.
- Wenn `includeVDI = true`, sollen mindestens `avdEnvironments = 1` und `avdConcurrentUsers > 0` empfohlen werden.

### Custom Apps

- Wenn `includeCustomApps = true`, sollen `customApps` und `maintenanceHoursPerMonth` sichtbar sein.
- Wenn Custom Apps mit VDI kombiniert werden, soll die Zusammenfassung “Custom Apps mit VDI-Abhängigkeit” anzeigen.

## UI-Beschrieb

### Layout

Desktop:

- Linke Sidebar: Eingaben
- Hauptbereich oben: KPI Cards
- Hauptbereich Mitte: Chart
- Hauptbereich unten: Offertenpositionen
- Rechte optionale Sidebar: Hinweise, Annahmen, Warnungen

Mobile:

- Inputs als Accordion
- Summary sticky oben
- Positionen als Cards

### KPI Cards

1. Monatlich wiederkehrend  
   Beispiel: CHF 7’288 / Monat

2. Jährlich wiederkehrend  
   Beispiel: CHF 87’456 / Jahr

3. Einmaliges Setup  
   Beispiel: CHF 8’170 einmalig

4. Geschätzte Marge  
   Beispiel: 62 %

5. Risiko-/Hinweisstatus  
   Beispiel: “OK”, “Marge tief”, “SOC-Voraussetzung prüfen”, “User-Mismatch”

### Charts

Mindestens diese Visualisierungen:

1. Donut Chart: Monatskosten nach Kategorie
2. Bar Chart: Top 10 teuerste Positionen
3. Optional: Waterfall Chart für Rabatt/Marge
4. Optional: Szenariovergleich Basic/Secure/Cloud

### Offertenpositionen

Tabelle mit:

| Service | Kategorie | Menge | Einheit | EP | VP | Monatlich | Jährlich | Setup | Hinweise |
|---|---|---:|---|---:|---:|---:|---:|---:|---|

Funktionen:

- Position aktiv/inaktiv schalten
- Einzelpreis überschreiben
- Rabatt pro Position überschreiben
- Notiz pro Position erfassen
- Zeile als “optional” markieren

## Beispiel-Szenario

Inputs:

```json
{
  "customerName": "Musterkunde AG",
  "tenantCount": 1,
  "entraMemberAccounts": 80,
  "m365LicensedUsers": 70,
  "adminAccounts": 3,
  "windowsClients": 65,
  "macClients": 8,
  "networkSites": 3,
  "vpnTunnels": 1,
  "guestWifiSites": 3,
  "includeVDI": true,
  "azureLandingZones": 1,
  "azureVMs": 3,
  "avdEnvironments": 1,
  "avdSessionHosts": 2,
  "avdConcurrentUsers": 12,
  "includeCustomApps": true,
  "customApps": 2,
  "customAppMaintenanceHoursPerMonth": 5,
  "hourlyRate": 160,
  "discountPercent": 0
}
```

Output:

```json
{
  "monthlyTotal": 7288,
  "yearlyTotal": 87456,
  "setupTotal": 8170,
  "categoryTotals": {
    "Identity & Access Management": 1110,
    "Collaboration": 1050,
    "Endpoint": 1985,
    "Cloud Infrastructure": 2533,
    "Network": 610
  }
}
```

## Gewünschte Komponenten

### `PricingCalculatorPage`

Hauptseite mit:

- State für Inputs
- Import des Preiskatalogs
- Berechnung der Line Items
- Übergabe an Chart- und Table-Komponenten

### `InputPanel`

Komponente für alle Mengen und Toggles.

### `SummaryCards`

Zeigt Monatskosten, Jahreskosten, Setup, Marge und Warnungen.

### `CategoryCostChart`

Donut oder Bar Chart mit Kosten pro Kategorie.

### `LineItemsTable`

Detaillierte Offertenpositionen.

### `ScenarioSelector`

Vordefinierte Presets:

- Basic Tenant
- Secure Identity
- Modern Workplace
- Cloud Infrastructure
- VDI / AVD
- Full Managed

### `ExportButtons`

- Export JSON
- Export Markdown
- Export CSV
- später PDF

## Beispiel-Code-Struktur

```txt
src/
  app/
    page.tsx
  components/
    InputPanel.tsx
    SummaryCards.tsx
    CategoryCostChart.tsx
    LineItemsTable.tsx
    ScenarioSelector.tsx
    ExportButtons.tsx
  lib/
    pricing.ts
    formatCurrency.ts
    presets.ts
  data/
    pricing-catalog.json
  types/
    pricing.ts
```

## TypeScript Types

```ts
export type BillingModel =
  | 'flat_per_unit'
  | 'volume_tier_total_quantity'
  | 'graduated_tier'
  | 'hours_per_app'

export type Category =
  | 'Identity & Access Management'
  | 'Collaboration'
  | 'Endpoint'
  | 'Cloud Infrastructure'
  | 'Network'
  | 'Custom Apps'

export interface PricingTier {
  from: number
  to: number | null
  vp: number
  ep: number
}

export interface ServiceDefinition {
  id: string
  name: string
  category: Category
  unit: string
  billingModel: BillingModel
  vp?: number
  ep?: number
  tiers?: PricingTier[]
  setup?: number
}

export interface CalculatorInputs {
  customerName: string
  tenantCount: number
  entraMemberAccounts: number
  m365LicensedUsers: number
  adminAccounts: number
  windowsClients: number
  macClients: number
  cloudPCs: number
  azureLandingZones: number
  azureVMs: number
  avdEnvironments: number
  avdSessionHosts: number
  avdConcurrentUsers: number
  networkSites: number
  vpnTunnels: number
  isolatedNetworks: number
  guestWifiSites: number
  publicWifiSites: number
  customApps: number
  customAppMaintenanceHoursPerMonth: number
  customMonitoringItems: number
  hourlyRate: number
  includeSOC: boolean
  includeBackup: boolean
  includeSecurityAwareness: boolean
  includeVDI: boolean
  includeCustomApps: boolean
  discountPercent: number
  marginTargetPercent: number
}

export interface LineItem {
  serviceId: string
  serviceName: string
  category: Category
  quantity: number
  unit: string
  unitPrice: number
  internalUnitCost: number
  monthly: number
  yearly: number
  setup: number
  grossMargin: number
  grossMarginPercent: number
  notes?: string[]
}
```

## Berechnungsfunktion

```ts
export function calculateQuote(
  inputs: CalculatorInputs,
  catalog: ServiceDefinition[]
) {
  const lineItems: LineItem[] = []

  // 1. Mengen auf Services mappen
  // 2. Preis je Service anhand billingModel berechnen
  // 3. Inaktive/ausgeblendete Services überspringen
  // 4. Rabatt anwenden
  // 5. Kategorie-Summen bilden
  // 6. Warnungen berechnen

  return {
    lineItems,
    monthlySubtotal,
    discountAmount,
    monthlyTotal,
    yearlyTotal,
    setupTotal,
    monthlyInternalCost,
    grossMargin,
    grossMarginPercent,
    categoryTotals,
    warnings
  }
}
```

## Warnungen und Business Rules

Die App soll Hinweise anzeigen, aber nicht zwingend blockieren.

Beispiele:

- “10 Entra-ID-Accounts sind nicht als M365-User enthalten.”
- “SOC aktiv, aber kein User Package vorhanden. Voraussetzung prüfen.”
- “VDI aktiv, aber keine Concurrent User gesetzt.”
- “Custom Apps aktiv, aber kein Maintenance Budget gesetzt.”
- “Marge unter Zielwert von 35 %.”
- “Mehr Admin Accounts als 10 % der User — bitte prüfen.”

## Export Markdown Beispiel

```md
# Offertenübersicht – Musterkunde AG

## Zusammenfassung

- Monatlich wiederkehrend: CHF 7’288
- Jährlich wiederkehrend: CHF 87’456
- Einmaliges Setup: CHF 8’170
- Geschätzte Marge: 62 %

## Positionen

| Position | Menge | Einzelpreis | Monatlich |
|---|---:|---:|---:|
| Managed Microsoft Tenant | 1 | CHF 175 | CHF 175 |
| Managed Entra ID | 80 | CHF 10 | CHF 800 |
| Managed Microsoft 365 User | 70 | CHF 15 | CHF 1’050 |
```

## Akzeptanzkriterien für MVP

- Die App startet lokal ohne Backend.
- Alle Preise liegen in einer editierbaren JSON-Datei.
- Mengenänderungen aktualisieren alle Summen sofort.
- Es gibt mindestens einen Chart nach Kategorie.
- Es gibt eine vollständige Line-Item-Tabelle.
- Es gibt Presets für typische Kundenszenarien.
- Export als JSON und Markdown funktioniert.
- Preislogik unterstützt Flat, Volume Tier, Graduated Tier und Custom-App-Stundenbudget.
- Warnungen werden sichtbar angezeigt.
- UI ist auf Desktop gut nutzbar und auf Mobile nicht kaputt.

## Prompt für Codex

Baue eine Next.js-WebApp mit TypeScript, Tailwind CSS, shadcn/ui und Recharts. Die App ist ein dynamischer Offertenrechner für Managed Services. Verwende eine lokale JSON-Datei als Preiskatalog. Implementiere Eingaben für Tenant, Entra-ID-Accounts, M365-User, Admin Accounts, Windows Clients, macOS Clients, Cloud PCs, Azure Landing Zones, Azure VMs, AVD Environment, AVD Session Hosts, AVD Concurrent Users, Network Sites, VPN Tunnels, Guest WiFi, Public WiFi, Custom Apps und Custom-App-Maintenance-Stunden.

Die App soll live monatliche Kosten, jährliche Kosten, Setup-Kosten, interne Kosten, Marge und Kategorie-Summen berechnen. Implementiere Preislogik für `flat_per_unit`, `volume_tier_total_quantity`, `graduated_tier` und `hours_per_app`. Zeige KPI Cards, ein Kategorie-Chart, eine Line-Item-Tabelle und Warnungen. Erstelle Presets für Basic, Secure Identity, Modern Workplace, Cloud/VDI und Full Managed. Implementiere Export als JSON und Markdown. Nutze Fantasiepreise aus dem Preiskatalog und schreibe den Code modular in `components`, `lib`, `data` und `types`.
