import type { DayKey } from "@/components/schedule/DaySelector";
import type {
  Der,
  Device,
  EntitlementView,
  ChargingSettings,
  ChargingHistoryEvent,
  ChargingSchedule,
  MetricsPeriod,
  MetricsSummary,
  OptimizationMode,
  PricePoint,
  PricePointResponse,
  SocLimitSource,
  UpdateChargingSchedulesRequest,
  ValueSummary,
  Vehicle,
  VehicleSession,
} from "@/lib/numiz-types";
import type { Period } from "@/lib/statistics-data";
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

const KEY_TO_DAY = {
  mon: "MONDAY",
  tue: "TUESDAY",
  wed: "WEDNESDAY",
  thu: "THURSDAY",
  fri: "FRIDAY",
  sat: "SATURDAY",
  sun: "SUNDAY",
} as const satisfies Record<DayKey, import("@/lib/numiz-types").DayOfWeek>;

export interface UiChargingSchedule {
  days: DayKey[];
  timeRange: { start: string; end: string };
}

export const FALLBACK_UI_CHARGING_SCHEDULE: UiChargingSchedule = {
  days: ["mon", "wed", "fri"],
  timeRange: { start: "21:00", end: "06:00" },
};

const EMPTY_UI_CHARGING_SCHEDULE: UiChargingSchedule = {
  days: [],
  timeRange: { start: "22:00", end: "06:00" },
};

/** First target (window start time) — charge off / baseline. */
const SCHEDULE_START_CHARGE = 0;
/** Second target (window end time) — full charge target. */
const SCHEDULE_END_CHARGE = 100;

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
  if (typeof point.price === "number") return point.price;
  return 0;
}

export function pricePointHour(point: PricePoint): number {
  return point.time.getHours();
}

export function sortPricePointsByTime(points: PricePoint[]): PricePoint[] {
  return [...points].sort((a, b) => a.time.getTime() - b.time.getTime());
}

export function pricePointMinutesSinceMidnight(point: PricePoint): number {
  return point.time.getHours() * 60 + point.time.getMinutes();
}

export function formatPricePointClock(point: PricePoint): string {
  const h = point.time.getHours();
  const m = point.time.getMinutes();
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Keep only points whose calendar day matches referenceDate (local timezone). */
export function filterPricePointsForLocalDay(
  points: PricePoint[],
  referenceDate = new Date(),
): PricePoint[] {
  const dayStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  return sortPricePointsByTime(points).filter(
    (p) => p.time >= dayStart && p.time < dayEnd,
  );
}

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

/** Nearest slot within 15 minutes, otherwise the latest point at or before now. */
export function findCurrentPricePoint(
  points: PricePoint[],
  now = new Date(),
): PricePoint | undefined {
  if (points.length === 0) return undefined;

  const sorted = sortPricePointsByTime(points);
  let nearest: PricePoint | undefined;
  let nearestDiff = FIFTEEN_MINUTES_MS;

  for (const point of sorted) {
    const diff = Math.abs(point.time.getTime() - now.getTime());
    if (diff < nearestDiff) {
      nearestDiff = diff;
      nearest = point;
    }
  }
  if (nearest) return nearest;

  let lastBefore: PricePoint | undefined;
  for (const point of sorted) {
    if (point.time <= now) lastBefore = point;
    else break;
  }
  return lastBefore ?? sorted[0];
}

function parsePriceTime(value: string | Date | undefined): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

type RawPricePoint = PricePointResponse & {
  time?: string | Date;
};

/** Normalize API payload to canonical PricePoint (parses time to Date). */
export function normalizePricePoint(raw: RawPricePoint): PricePoint {
  return {
    time: parsePriceTime(raw.time),
    priceKwh:
      typeof raw.priceKwh === "number"
        ? raw.priceKwh
        : raw.price ?? 0,
    displayCurrency: raw.displayCurrency ?? raw.currency ?? "SEK",
    priceZone: raw.priceZone ?? "",
    price: raw.priceKwh ?? raw.price ?? 0,
    currency: raw.currency ?? "SEK",
    unit: raw.unit ?? "KWH",
  };
}

export function mapPricePointsToHourly(
  points: PricePoint[],
): { hour: number; priceKwh: number }[] {
  return points.map((p) => ({
    hour: pricePointHour(p),
    priceKwh: priceKwhOf(p),
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
    charged: summary.charge.kwh,
    v2h: summary.discharge.kwh,
    cost: summary.total.price,
  };
}

export function mapUiPeriodToMetricsPeriod(period: Period): MetricsPeriod {
  switch (period) {
    case "D":
      return "TODAY";
    case "W":
      return "THIS_WEEK";
    case "M":
      return "THIS_MONTH";
    case "Y":
      return "THIS_YEAR";
  }
}

export interface ChartRow {
  day?: string;
  week?: string;
  month?: string;
  hour?: string;
  charged: number;
  v2h: number;
  cost: number;
}

const WEEKDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const MONTH_KEYS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
] as const;

type WeekdayKey = (typeof WEEKDAY_KEYS)[number];
type MonthKey = (typeof MONTH_KEYS)[number];

export function mapMetricsBreakdownToChart(
  breakdown: ValueSummary[],
  period: Period,
  dayLabels?: Record<WeekdayKey, string>,
  monthLabels?: Record<MonthKey, string>,
): ChartRow[] {
  return breakdown.map((bucket, index) => {
    const charged = bucket.charge.kwh;
    const v2h = bucket.discharge.kwh;
    const cost = bucket.total.price;

    switch (period) {
      case "D":
        return { hour: String(index).padStart(2, "0"), charged, v2h, cost };
      case "W": {
        const key = WEEKDAY_KEYS[index] ?? "mon";
        return { day: dayLabels?.[key] ?? key, charged, v2h, cost };
      }
      case "M":
        return { week: `V${index + 1}`, charged, v2h, cost };
      case "Y": {
        const key = MONTH_KEYS[index] ?? "jan";
        const label = monthLabels?.[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
        return { month: label, charged, v2h, cost };
      }
    }
  });
}

export interface ChargingHistoryUiRow {
  id: string;
  date: string;
  time: string;
  energy: number;
  cost: number;
  type: "charging" | "v2h";
  priceAvg: number;
}

export function mapChargingHistoryToUi(
  events: ChargingHistoryEvent[],
  locale = "sv-SE",
): ChargingHistoryUiRow[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  return [...events]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .map((event) => {
      const ts = new Date(event.ts);
      let date: string;
      if (ts >= todayStart) {
        date = "Idag";
      } else if (ts >= yesterdayStart) {
        date = "Igår";
      } else {
        date = ts.toLocaleDateString(locale, { day: "numeric", month: "short" });
      }

      const time = ts.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
      const type = event.state === "DISCHARGING" ? "v2h" : "charging";
      const priceAvg =
        event.energyKwh > 0 ? event.price / event.energyKwh : 0;

      return {
        id: event.id,
        date,
        time,
        energy: event.energyKwh,
        cost: event.price,
        type,
        priceAvg,
      };
    });
}

export function buildPriceDayRange(day: "today" | "tomorrow"): { from: string; to: string } {
  const base = new Date();
  if (day === "tomorrow") {
    base.setDate(base.getDate() + 1);
  }
  const start = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const format = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  return { from: format(start), to: format(end) };
}

export const FALLBACK_HOURLY_PRICES: { hour: number; priceKwh: number }[] = [
  { hour: 0, priceKwh: 0.32 },
  { hour: 1, priceKwh: 0.28 },
  { hour: 2, priceKwh: 0.25 },
  { hour: 3, priceKwh: 0.22 },
  { hour: 4, priceKwh: 0.20 },
  { hour: 5, priceKwh: 0.24 },
  { hour: 6, priceKwh: 0.45 },
  { hour: 7, priceKwh: 0.68 },
  { hour: 8, priceKwh: 0.82 },
  { hour: 9, priceKwh: 0.75 },
  { hour: 10, priceKwh: 0.62 },
  { hour: 11, priceKwh: 0.55 },
  { hour: 12, priceKwh: 0.58 },
  { hour: 13, priceKwh: 0.52 },
  { hour: 14, priceKwh: 0.48 },
  { hour: 15, priceKwh: 0.55 },
  { hour: 16, priceKwh: 0.72 },
  { hour: 17, priceKwh: 0.95 },
  { hour: 18, priceKwh: 0.88 },
  { hour: 19, priceKwh: 0.65 },
  { hour: 20, priceKwh: 0.52 },
  { hour: 21, priceKwh: 0.45 },
  { hour: 22, priceKwh: 0.38 },
  { hour: 23, priceKwh: 0.32 },
];

export function fallbackPricePoints(referenceDate = new Date()): PricePoint[] {
  const dayStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  return FALLBACK_HOURLY_PRICES.map(({ hour, priceKwh }) => {
    const time = new Date(dayStart);
    time.setHours(hour, 0, 0, 0);
    return normalizePricePoint({
      time: time.toISOString(),
      priceKwh,
      displayCurrency: "SEK",
      priceZone: "SE3",
      price: priceKwh,
      currency: "SEK",
      unit: "KWH",
    });
  });
}

/** Full-day series for chart: filter to local calendar day, or hourly fallback when empty. */
export function fillPricePointsDay(
  points: PricePoint[],
  referenceDate = new Date(),
): PricePoint[] {
  const filtered = filterPricePointsForLocalDay(points, referenceDate);
  if (filtered.length === 0) {
    return fallbackPricePoints(referenceDate);
  }

  return filtered;
}

export function statsFromMetricsSummary(summary: MetricsSummary | null): {
  charged: number;
  v2h: number;
  cost: number;
} | null {
  if (!summary) return null;
  return mapValueSummaryToStats(summary.summary);
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

function toApiLocalTime(hhmm: string): string {
  return hhmm.length === 5 ? `${hhmm}:00` : hhmm;
}

export function mapChargingSchedulesToUi(
  schedules: ChargingSchedule[],
  useFallbackWhenEmpty = false,
): UiChargingSchedule {
  const first = schedules[0];
  if (!first) {
    return useFallbackWhenEmpty ? FALLBACK_UI_CHARGING_SCHEDULE : EMPTY_UI_CHARGING_SCHEDULE;
  }

  const days = mapScheduleDaysToKeys(first.days);
  const timeRange = mapScheduleTimeRange(first.target);

  return {
    days,
    timeRange: timeRange ?? EMPTY_UI_CHARGING_SCHEDULE.timeRange,
  };
}

export function mapUiScheduleToApi(
  days: DayKey[],
  timeRange: { start: string; end: string },
): UpdateChargingSchedulesRequest {
  return {
    schedules: [
      {
        days: days.map((day) => KEY_TO_DAY[day]),
        target: [
          { time: toApiLocalTime(timeRange.start), charge: SCHEDULE_START_CHARGE },
          { time: toApiLocalTime(timeRange.end), charge: SCHEDULE_END_CHARGE },
        ],
      },
    ],
  };
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
