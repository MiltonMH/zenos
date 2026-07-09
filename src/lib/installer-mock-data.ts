// Mock data for the installer ("Omnia") flow prototype — no backend, UI only.

export type ArcStatus = "active" | "awaiting_customer";
export type ChargingMode = "idle" | "charging" | "v2h" | "v2g" | "disconnected";

export interface InstalledUnit {
  id: string;
  customerName: string;
  address: string;
  installedDate: string;
  status: ArcStatus;
  chargingMode: ChargingMode;
  batteryLevel: number;
  online: boolean;
}

export const mockInstaller = {
  companyName: "ElTech Solutions AB",
  contactName: "Johan Bergström",
  phone: "+46 70 987 65 43",
  certification: "Nivå 2 – Elbehörighet",
};

export const initialInstalledUnits: InstalledUnit[] = [
  {
    id: "arc-1",
    customerName: "Anna Svensson",
    address: "Kungsgatan 12, Göteborg",
    installedDate: "3 juli 2026",
    status: "active",
    chargingMode: "charging",
    batteryLevel: 62,
    online: true,
  },
  {
    id: "arc-2",
    customerName: "Erik Lindqvist",
    address: "Vasagatan 4, Mölndal",
    installedDate: "28 juni 2026",
    status: "awaiting_customer",
    chargingMode: "disconnected",
    batteryLevel: 0,
    online: false,
  },
];

export const installerFuseOptions = ["16A", "20A", "25A", "32A"];

export const evModels = [
  "Tesla Model Y",
  "Tesla Model 3",
  "Volvo EX30",
  "Volvo XC40 Recharge",
  "Volkswagen ID.4",
  "Kia EV6",
  "Polestar 2",
  "Annan modell",
];

// Naive mock check used only to demo the "existing vs. new customer" branch from the spec.
export function mockCustomerExists(email: string): boolean {
  return email.trim().toLowerCase().startsWith("anna");
}
