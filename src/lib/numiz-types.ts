export type DeviceType =
  | "inverter"
  | "battery"
  | "ev_charger"
  | "v2x_charger"
  | "energy_meter";

export type DeviceStatus = "OFFLINE" | "ONLINE" | "FAULT";

export type DerType = "solar" | "battery" | "meter" | "ev_charger_port";

export type DerStatus =
  | "IDLE"
  | "CHARGING"
  | "DISCHARGING"
  | "GENERATING"
  | "FAULT";

export type SessionState = "IDLE" | "CHARGING" | "DISCHARGING" | "FAULT";

export type EntitlementTier = "NONE" | "SMALL" | "LARGE";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type SiteCurrency = "SEK" | "EUR";

export interface Site {
  id: string;
  name: string;
  ownerUserId: string | null;
  address: string | null;
  gridArea: string;
  currency: SiteCurrency;
  createdAt: string;
}

export interface Device {
  id: string;
  hardwareId: string;
  gatewaySerial: string | null;
  deviceType: DeviceType;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  status: DeviceStatus;
  siteId: string;
  externalRef: string | null;
  createdAt: string;
}

export interface Der {
  id: string;
  deviceId: string;
  type: DerType;
  category: string;
  name: string | null;
  status: DerStatus;
  ratedPowerKw: number | null;
  capacityKwh: number | null;
  maxChargeKw: number | null;
  maxDischargeKw: number | null;
  cRate: number | null;
  rampRateKwPerMin: number | null;
  socPercent: number | null;
  minSocPercent: number | null;
  maxSocPercent: number | null;
  targetSocPercent: number | null;
  deadlineAt: string | null;
  externalRef: string | null;
  attributes: Record<string, unknown> | null;
  createdAt: string;
}

export interface VehicleSession {
  id: string;
  derId: string;
  vehicleId: string | null;
  socPercent: number | null;
  minSocPercent: number | null;
  targetSocPercent: number | null;
  departureAt: string | null;
  v2xEnabled: boolean;
  state: SessionState;
  startedAt: string;
  endedAt: string | null;
  chargePointId: string | null;
  evseId: string | null;
  idToken: string | null;
}

export interface ChargeTarget {
  time: string;
  charge: number;
}

export interface ChargingSchedule {
  id: string;
  days: DayOfWeek[];
  target: ChargeTarget[];
}

export interface Vehicle {
  id: string;
  vin: string | null;
  siteId: string | null;
  make: string | null;
  model: string | null;
  modelYear: number | null;
  label: string | null;
  createdAt: string;
  chargingSchedules?: ChargingSchedule[];
}

export interface VehicleSummary {
  id: string;
  vin: string | null;
  siteId: string | null;
  make: string | null;
  modelYear: number | null;
  label: string | null;
  createdAt: string;
  chargingSchedules: ChargingSchedule[];
}

export interface PricePoint {
  ts: string;
  /** Display price per kWh in displayCurrency. */
  priceKwh: number;
  displayCurrency: string;
  gridArea: string;
  /** Raw stored price. */
  price: number;
  /** Source currency of the stored quote. */
  currency: string;
  unit: string;
  /** @deprecated Prefer priceKwh — kept for older payloads. */
  priceSekKwh?: number;
}

export interface ValueSummary {
  totalValueSek: number;
  chargeValueSek: number;
  dischargeValueSek: number;
  totalEnergyKwh: number;
  eventCount: number;
}

export interface EntitlementView {
  siteId: string;
  tier: EntitlementTier;
  sourceful_enabled: boolean;
}

export interface DeviceView {
  device: Device;
  ders: Der[];
}
