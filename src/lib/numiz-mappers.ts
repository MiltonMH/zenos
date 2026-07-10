import type { DayKey } from "@/components/schedule/DaySelector";
import type {
  Der,
  Device,
  EntitlementView,
  ChargingSettings,
  OptimizationMode,
  PricePoint,
  SocLimitSource,
  ValueSummary,
  Vehicle,
  VehicleSession,
} from "@/lib/numiz-types";
import type { ArcStatus, ChargingMode, InstalledUnit } from "@/lib/installer-mock-data";
import type {
  CreateInstallationRequest,
  InstallationDetail,
  InstallationSummary,
  InstallationVehicleSpec,
  InstallerCompanyMeResponse,
  InstallerDeviceChargingMode,
} from "@/lib/numiz-types";

const DAY_TO_KEY: Record<string, DayKey> = {
  MONDAY: "mon",
  TUESDAY: "tue",
  WEDNESDAY: "wed",
  THURSDAY: "thu",
  FRIDAY: "fri",
  SATURDAY: "sat",
  SUNDAY: "sun",
};

const CHARGER_DEVICE_TYPES = new Set(["v2x_charger", "ev_charger"]);

export function firstNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const part = local.split(/[._-]/)[0] ?? local;
  if (!part) return email;
  return part.charAt(0).toUpperCase() + part.slice(1);
}

export function findChargerDevice(devices: Device[]): Device | null {
  return devices.find((d) => CHARGER_DEVICE_TYPES.has(d.deviceType)) ?? null;
}

export function findChargerDer(ders: Der[]): Der | null {
  return ders.find((d) => d.type === "ev_charger_port") ?? ders[0] ?? null;
}

export function findMeterDevice(devices: Device[]): Device | null {
  return devices.find((d) => d.deviceType === "energy_meter") ?? null;
}

export function findMeterDer(ders: Der[]): Der | null {
  return ders.find((d) => d.type === "meter") ?? null;
}

export type SettingsUiStatus =
  | "charging"
  | "idle"
  | "v2h"
  | "v2g"
  | "searching"
  | "error";

export function mapDerStatusToSettingsUi(
  status: string | null | undefined,
): SettingsUiStatus {
  switch (status) {
    case "CHARGING":
      return "charging";
    case "DISCHARGING":
      return "v2h";
    case "FAULT":
      return "error";
    case "IDLE":
    case "GENERATING":
    default:
      return "idle";
  }
}

export function mapFirmwareVersion(der: Der | null): string | null {
  const firmware = der?.attributes?.firmwareVersion;
  if (typeof firmware === "string" && firmware.trim()) return firmware.trim();
  return mapOcppVersion(der);
}

export function toPercentSlider(value: number, fallback: number): number[] {
  if (Number.isNaN(value)) return [fallback];
  return [Math.round(Math.max(0, Math.min(100, value)))];
}

const OPTIMIZATION_MODES: readonly OptimizationMode[] = [
  "savings",
  "balanced",
  "protection",
] as const;

export function mapOptimizationMode(raw: string | null | undefined): OptimizationMode {
  const normalized = raw?.trim().toLowerCase();
  if (normalized && (OPTIMIZATION_MODES as readonly string[]).includes(normalized)) {
    return normalized as OptimizationMode;
  }
  return "balanced";
}

export function mapSocLimitSource(raw: string | null | undefined): SocLimitSource {
  switch (raw?.trim().toLowerCase()) {
    case "vehicle":
      return "vehicle";
    case "defaults":
      return "defaults";
    case "der":
    default:
      return "der";
  }
}

/** Normalize GET/PUT charging-settings JSON (enum case may vary). */
export function mapChargingSettings(
  raw: ChargingSettings & { socLimitSource?: string; optimizationMode?: string },
): ChargingSettings {
  return {
    deviceId: String(raw.deviceId),
    maxChargeSocPercent: Number(raw.maxChargeSocPercent),
    minDischargeSocPercent: Number(raw.minDischargeSocPercent),
    v2hEnabled: Boolean(raw.v2hEnabled),
    v2gEnabled: Boolean(raw.v2gEnabled),
    optimizationMode: mapOptimizationMode(raw.optimizationMode),
    socLimitSource: mapSocLimitSource(raw.socLimitSource),
    vehicleId: raw.vehicleId ?? null,
    v2xEffective: Boolean(raw.v2xEffective),
  };
}

export function findSessionForDer(
  sessions: VehicleSession[],
  derId: string | undefined,
): VehicleSession | null {
  if (!derId) return null;
  return sessions.find((s) => s.derId === derId && !s.endedAt) ?? null;
}

export function mapVehicleLabel(vehicle: Vehicle | null): string | null {
  if (!vehicle) return null;
  if (vehicle.label?.trim()) return vehicle.label.trim();
  const parts = [vehicle.make, vehicle.model].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

export function mapChargerModel(device: Device | null): string | null {
  if (!device) return null;
  if (device.model?.trim()) {
    return device.manufacturer?.trim()
      ? `${device.manufacturer} ${device.model}`
      : device.model;
  }
  return device.manufacturer?.trim() ?? device.name?.trim() ?? null;
}

export function mapIsPremium(entitlement: EntitlementView | null): boolean {
  return entitlement?.tier !== undefined && entitlement.tier !== "NONE";
}

export function mapBatteryLevel(
  session: VehicleSession | null,
  der: Der | null,
): number {
  const soc = session?.socPercent ?? der?.socPercent;
  if (typeof soc === "number" && !Number.isNaN(soc)) {
    return Math.round(Math.max(0, Math.min(100, soc)));
  }
  return 0;
}

export function mapChargingMode(
  session: VehicleSession | null,
  der: Der | null,
): ChargingMode {
  const state = session?.state ?? der?.status;
  switch (state) {
    case "CHARGING":
      return "charging";
    case "DISCHARGING":
      return "v2h";
    case "FAULT":
      return "disconnected";
    case "IDLE":
    case "GENERATING":
    default:
      return "idle";
  }
}

export function mapFuseFromAttributes(der: Der | null): string | null {
  const fuseAmps = der?.attributes?.fuseAmps;
  if (typeof fuseAmps === "number") return `${fuseAmps}A`;
  if (typeof fuseAmps === "string" && fuseAmps.trim()) return fuseAmps;
  return null;
}

export function priceKwhOf(point: PricePoint): number {
  if (typeof point.priceKwh === "number") return point.priceKwh;
  if (typeof point.priceSekKwh === "number") return point.priceSekKwh;
  return 0;
}

export function mapPricePointsToHourly(
  points: PricePoint[],
): { hour: number; price: number }[] {
  return points.map((p) => ({
    hour: new Date(p.ts).getHours(),
    price: priceKwhOf(p),
  }));
}

export function mapOcppVersion(der: Der | null): string | null {
  const version = der?.attributes?.ocppVersion;
  if (typeof version === "string" && version.trim()) return version.trim();
  return null;
}

export function mapValueSummaryToStats(summary: ValueSummary | null): {
  charged: number;
  v2h: number;
  cost: number;
} | null {
  if (!summary) return null;
  return {
    charged: summary.totalEnergyKwh,
    v2h: summary.dischargeValueSek,
    cost: summary.totalValueSek,
  };
}

export function mapScheduleDaysToKeys(days: string[]): DayKey[] {
  return days
    .map((d) => DAY_TO_KEY[d])
    .filter((d): d is DayKey => d !== undefined);
}

export function mapScheduleTimeRange(
  target: { time: string }[] | undefined,
): { start: string; end: string } | null {
  if (!target?.length) return null;
  const start = target[0]?.time?.slice(0, 5);
  const end = target.length > 1 ? target[target.length - 1]?.time?.slice(0, 5) : start;
  if (!start) return null;
  return { start, end: end ?? start };
}

export function formatSiteDate(iso: string, locale = "sv-SE"): string {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function mapInstallationStatus(status: InstallationSummary["status"]): ArcStatus {
  return status === "ACTIVE" ? "active" : "awaiting_customer";
}

export function mapInstallerDeviceChargingMode(
  mode: InstallerDeviceChargingMode | null | undefined,
  online: boolean,
): ChargingMode {
  if (!online || mode === "offline") return "disconnected";
  switch (mode) {
    case "charging":
      return "charging";
    case "discharging":
      return "v2h";
    case "fault":
      return "disconnected";
    case "idle":
    case "generating":
    default:
      return "idle";
  }
}

export function mapInstallationToUnit(
  installation: InstallationSummary,
  locale = "sv-SE",
): InstalledUnit {
  const customerName =
    installation.customer.displayName?.trim() ||
    firstNameFromEmail(installation.customer.email);

  return {
    id: installation.id,
    customerName,
    address: installation.address,
    installedDate: formatSiteDate(installation.installedAt, locale),
    status: mapInstallationStatus(installation.status),
    chargingMode: mapInstallerDeviceChargingMode(
      installation.device.chargingMode,
      installation.device.online,
    ),
    batteryLevel:
      typeof installation.device.batteryLevel === "number"
        ? Math.round(Math.max(0, Math.min(100, installation.device.batteryLevel)))
        : 0,
    online: installation.device.online,
  };
}

export function mapCompanyMeToProfile(company: InstallerCompanyMeResponse) {
  return {
    companyName: company.name,
    contactName: company.contactName ?? "",
    phone: company.phone ?? company.contactPhone ?? "",
    certification: company.certification ?? "",
  };
}

export function parseEvModelToVehicleSpec(evModel: string): InstallationVehicleSpec {
  const trimmed = evModel.trim();
  if (!trimmed) return { label: trimmed };

  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex <= 0) {
    return { label: trimmed };
  }

  return {
    make: trimmed.slice(0, spaceIndex),
    model: trimmed.slice(spaceIndex + 1),
    label: trimmed,
  };
}

export interface BuildCreateInstallationParams {
  customerEmail: string;
  address: string;
  hardwareId: string;
  fuse: string;
  consumption: string;
  evModel: string;
  gridCompany?: string | null;
  electricityProvider?: string | null;
}

export function buildCreateInstallationRequest(
  params: BuildCreateInstallationParams,
): CreateInstallationRequest {
  const fuseAmps = Number.parseInt(params.fuse.replace(/\D/g, ""), 10);
  const annualConsumptionKwh = Number.parseFloat(params.consumption.replace(",", "."));
  const vehicle = params.evModel.trim()
    ? parseEvModelToVehicleSpec(params.evModel)
    : null;

  return {
    customerEmail: params.customerEmail.trim(),
    address: params.address.trim(),
    siteName: params.address.trim(),
    gridArea: "SE3",
    currency: "SEK",
    gridCompany: params.gridCompany?.trim() || null,
    electricityProvider: params.electricityProvider?.trim() || null,
    annualConsumptionKwh: Number.isFinite(annualConsumptionKwh) ? annualConsumptionKwh : null,
    hardwareId: params.hardwareId.trim(),
    deviceType: "v2x_charger",
    deviceName: "V2X Charger",
    manufacturer: "Wallbox",
    model: "Quasar 2",
    fuseAmps: Number.isFinite(fuseAmps) ? fuseAmps : null,
    vehicle,
  };
}

export function buildEvCatalogFromVehicles(
  vehicles: { make: string | null; model?: string | null; label?: string | null }[],
): { brands: string[]; modelsByBrand: Record<string, string[]>; models: string[] } {
  const modelsByBrand: Record<string, string[]> = {};

  for (const vehicle of vehicles) {
    const brand = vehicle.make?.trim();
    if (!brand) continue;

    const model =
      vehicle.model?.trim() ||
      vehicle.label?.trim() ||
      null;
    if (!model) continue;

    if (!modelsByBrand[brand]) modelsByBrand[brand] = [];
    if (!modelsByBrand[brand].includes(model)) {
      modelsByBrand[brand].push(model);
    }
  }

  const brands = Object.keys(modelsByBrand).sort();
  const models = brands.flatMap((b) => modelsByBrand[b]);

  return { brands, modelsByBrand, models };
}
