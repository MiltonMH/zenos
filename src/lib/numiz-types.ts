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

export type UserRole =
  | "ADMIN"
  | "INSTALLER"
  | "SITE_OWNER"
  | "SITE_MEMBER"
  | "VIEWER";

export type InstallerCompanyRole = "COMPANY_OWNER" | "COMPANY_MEMBER";

export type InstallationStatus = "AWAITING_CUSTOMER" | "ACTIVE";

export type InstallerDeviceChargingMode =
  | "idle"
  | "charging"
  | "discharging"
  | "fault"
  | "offline"
  | "generating";

/** ZenOS Settings optimization mode — matches device_charging_settings. */
export type OptimizationMode = "savings" | "balanced" | "protection";

/** Effective SoC source from GET/PUT /devices/{id}/charging-settings. */
export type SocLimitSource = "der" | "vehicle" | "defaults";

/** GET/PUT /devices/{id}/charging-settings */
export interface ChargingSettings {
  deviceId: string;
  maxChargeSocPercent: number;
  minDischargeSocPercent: number;
  v2hEnabled: boolean;
  v2gEnabled: boolean;
  optimizationMode: OptimizationMode;
  socLimitSource: SocLimitSource;
  vehicleId: string | null;
  v2xEffective: boolean;
}

/** PUT /devices/{id}/charging-settings — all fields optional (partial). */
export interface UpdateChargingSettingsRequest {
  maxChargeSocPercent?: number;
  minDischargeSocPercent?: number;
  v2hEnabled?: boolean;
  v2gEnabled?: boolean;
  optimizationMode?: OptimizationMode;
}

export interface InstallerCompanySummary {
  id: string;
  name: string;
  phone: string | null;
  certification: string | null;
  companyRole: InstallerCompanyRole;
}

/** GET /users/me */
export interface MeResponse {
  id: string;
  email: string;
  displayName: string | null;
  phoneNumber: string | null;
  role: UserRole;
  locale: string | null;
  passwordConfigured: boolean;
  installerCompany: InstallerCompanySummary | null;
}

/** GET /installer/companies/me */
export interface InstallerCompanyMeResponse {
  id: string;
  name: string;
  phone: string | null;
  certification: string | null;
  companyRole: InstallerCompanyRole;
  contactName: string | null;
  contactPhone: string | null;
}

export interface InstallationCustomerView {
  userId: string;
  email: string;
  displayName: string | null;
}

export interface InstallationDeviceView {
  id: string;
  status: DeviceStatus;
  online: boolean;
  chargingMode: InstallerDeviceChargingMode | null;
  batteryLevel: number | null;
}

export interface InstallationSummary {
  id: string;
  siteId: string;
  address: string;
  installedAt: string;
  status: InstallationStatus;
  customer: InstallationCustomerView;
  device: InstallationDeviceView;
}

export interface InstallationDetail extends InstallationSummary {
  gridCompany: string | null;
  electricityProvider: string | null;
  annualConsumptionKwh: number | null;
  siteName: string | null;
}

export interface InstallationVehicleSpec {
  vin?: string | null;
  make?: string | null;
  model?: string | null;
  modelYear?: number | null;
  label?: string | null;
}

export interface CreateInstallationRequest {
  customerEmail: string;
  customerDisplayName?: string | null;
  customerPhone?: string | null;
  siteName?: string | null;
  address: string;
  gridArea?: string | null;
  currency?: SiteCurrency | null;
  gridCompany?: string | null;
  electricityProvider?: string | null;
  annualConsumptionKwh?: number | null;
  hardwareId: string;
  gatewaySerial?: string | null;
  deviceType?: DeviceType | null;
  deviceName?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  fuseAmps?: number | null;
  vehicle?: InstallationVehicleSpec | null;
}

export interface InstallationCreateResponse {
  installation: InstallationDetail;
  customerPassword: string | null;
  deviceId: string;
}

/** GET /sites/{id}/installer — site's installing company (customer-facing). */
export interface SiteInstallerResponse {
  companyName: string;
  phone: string | null;
  certification: string | null;
  contactName: string | null;
  contactPhone: string | null;
  installedAt: string;
}

export interface Site {
  id: string;
  name: string;
  ownerUserId: string | null;
  address: string | null;
  gridArea: string;
  currency: SiteCurrency;
  gridCompany?: string | null;
  electricityProvider?: string | null;
  annualConsumptionKwh?: number | null;
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
  pinCode: string | null;
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
