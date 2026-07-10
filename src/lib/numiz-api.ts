import {
  clearBasicSession,
  clearSsoSession,
  readBasicSession,
  readSsoSession,
  type BasicAuthSession,
  type SsoProvider,
  type SsoSession,
} from "@/lib/auth-config";
import type {
  ChargingSchedule,
  ChargingSettings,
  Device,
  DeviceView,
  EntitlementView,
  MeResponse,
  PricePoint,
  Site,
  CreateInstallationRequest,
  InstallationCreateResponse,
  InstallationDetail,
  InstallationSummary,
  InstallerCompanyMeResponse,
  SiteInstallerResponse,
  UpdateChargingSettingsRequest,
  ValueSummary,
  Vehicle,
  VehicleSession,
  VehicleSummary,
} from "@/lib/numiz-types";

export class NumizAuthError extends Error {
  constructor(message = "UNAUTHORIZED") {
    super(message);
    this.name = "NumizAuthError";
  }
}

export class NumizForbiddenError extends Error {
  constructor(message = "FORBIDDEN") {
    super(message);
    this.name = "NumizForbiddenError";
  }
}

export interface OAuthTokenResponse {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

export interface AuthProvidersResponse {
  basic?: Record<string, never>;
  google?: { client_id: string };
  apple?: { client_id: string };
}

export interface JwtToken {
  token: string;
  type: string;
  expiresAt: string;
}

export interface LoginResponse {
  token: JwtToken;
  refreshToken: JwtToken;
  email: string;
}

interface ApiErrorBody {
  error?: string;
  message?: string;
}

export function getNumizApiBase(): string {
  if (import.meta.env.DEV) {
    return "/numiz-api";
  }

  const baseUrl = import.meta.env.VITE_NUMIZ_API_URL;
  if (!baseUrl) {
    throw new Error("VITE_NUMIZ_API_URL is not configured");
  }

  return baseUrl.replace(/\/$/, "");
}

async function parseApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (body.message?.includes("not configured")) {
      return "PROVIDER_NOT_AVAILABLE";
    }
    if (body.message?.includes("token exchange failed")) {
      return "TOKEN_EXCHANGE_FAILED";
    }
    if (body.message) return body.message;
    if (body.error) return body.error;
  } catch {
    // Fall through.
  }

  if (response.status === 401) {
    return "UNAUTHORIZED";
  }

  if (response.status === 403) {
    return "FORBIDDEN";
  }

  return "REQUEST_FAILED";
}

export function getAuthToken(): string | null {
  const basic = readBasicSession();
  if (basic?.accessToken) return basic.accessToken;

  const sso = readSsoSession();
  if (sso?.idToken) return sso.idToken;

  return null;
}

async function numizFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getNumizApiBase()}${path}`, init);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<T>;
}

export async function numizAuthFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  if (!token) {
    throw new NumizAuthError();
  }

  const response = await fetch(`${getNumizApiBase()}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    clearBasicSession();
    clearSsoSession();
    throw new NumizAuthError();
  }

  if (response.status === 403) {
    throw new NumizForbiddenError(await parseApiError(response));
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchAuthProviders(): Promise<AuthProvidersResponse> {
  return numizFetch<AuthProvidersResponse>("/auth/providers");
}

function encodeBasicAuth(email: string, password: string): string {
  return btoa(`${email.trim()}:${password}`);
}

export async function loginWithBasicAuth(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${getNumizApiBase()}/auth/login`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodeBasicAuth(email.trim(), password)}`,
    },
  });

  if (response.status === 401) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<LoginResponse>;
}

export async function refreshBasicAuth(refreshToken: string): Promise<LoginResponse> {
  const params = new URLSearchParams({ refreshToken });
  return numizFetch<LoginResponse>(`/auth/refresh?${params.toString()}`, { method: "POST" });
}

export function loginResponseToBasicSession(response: LoginResponse): BasicAuthSession {
  return {
    email: response.email,
    accessToken: response.token.token,
    refreshToken: response.refreshToken.token,
    accessExpiresAt: new Date(response.token.expiresAt).getTime(),
    refreshExpiresAt: new Date(response.refreshToken.expiresAt).getTime(),
  };
}

function buildTokenExchangeUrl(path: string, code: string, redirectUri: string): string {
  const params = new URLSearchParams({ code, redirectUri });
  return `${path}?${params.toString()}`;
}

export async function exchangeGoogleToken(
  code: string,
  redirectUri: string,
): Promise<OAuthTokenResponse> {
  return numizFetch<OAuthTokenResponse>(
    buildTokenExchangeUrl("/auth/google/token", code, redirectUri),
    { method: "POST" },
  );
}

export async function exchangeAppleToken(
  code: string,
  redirectUri: string,
): Promise<OAuthTokenResponse> {
  return numizFetch<OAuthTokenResponse>(
    buildTokenExchangeUrl("/auth/apple/token", code, redirectUri),
    { method: "POST" },
  );
}

export function tokenResponseToSsoSession(
  provider: SsoProvider,
  tokens: OAuthTokenResponse,
): SsoSession {
  if (!tokens.id_token) {
    throw new Error("MISSING_ID_TOKEN");
  }

  return {
    provider,
    idToken: tokens.id_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
  };
}

export async function fetchUserMe(): Promise<MeResponse> {
  return numizAuthFetch<MeResponse>("/users/me");
}

export async function fetchSites(): Promise<Site[]> {
  return numizAuthFetch<Site[]>("/sites");
}

/** Returns null when the site has no installer record (404). */
export async function fetchSiteInstaller(
  siteId: string,
): Promise<SiteInstallerResponse | null> {
  const token = getAuthToken();
  if (!token) throw new NumizAuthError();

  const response = await fetch(`${getNumizApiBase()}/sites/${siteId}/installer`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    clearBasicSession();
    clearSsoSession();
    throw new NumizAuthError();
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<SiteInstallerResponse>;
}

export async function fetchSiteDevices(siteId: string): Promise<Device[]> {
  return numizAuthFetch<Device[]>(`/sites/${siteId}/devices`);
}

export async function fetchDevice(id: string): Promise<DeviceView> {
  return numizAuthFetch<DeviceView>(`/devices/${id}`);
}

export async function fetchSessions(): Promise<VehicleSession[]> {
  return numizAuthFetch<VehicleSession[]>("/sessions");
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  return numizAuthFetch<Vehicle[]>("/vehicles");
}

export async function fetchVehiclesAll(): Promise<VehicleSummary[]> {
  return numizAuthFetch<VehicleSummary[]>("/vehicles/all");
}

export async function fetchCurrentPrice(siteId?: string): Promise<PricePoint | null> {
  const params = new URLSearchParams();
  if (siteId) params.set("siteId", siteId);
  const query = params.toString();
  const path = query ? `/prices/current?${query}` : "/prices/current";

  const token = getAuthToken();
  if (!token) throw new NumizAuthError();

  const response = await fetch(`${getNumizApiBase()}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    clearBasicSession();
    clearSsoSession();
    throw new NumizAuthError();
  }

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<PricePoint>;
}

export async function fetchPrices(
  from: string,
  to: string,
  siteId?: string,
): Promise<PricePoint[]> {
  const params = new URLSearchParams({ from, to });
  if (siteId) params.set("siteId", siteId);
  return numizAuthFetch<PricePoint[]>(`/prices?${params.toString()}`);
}

export async function fetchValueSummary(siteId: string): Promise<ValueSummary> {
  const params = new URLSearchParams({ siteId });
  return numizAuthFetch<ValueSummary>(`/value/summary?${params.toString()}`);
}

export async function fetchEntitlements(siteId: string): Promise<EntitlementView> {
  return numizAuthFetch<EntitlementView>(`/sites/${siteId}/entitlements`);
}

export async function fetchChargingSchedules(vehicleId: string): Promise<ChargingSchedule[]> {
  return numizAuthFetch<ChargingSchedule[]>(`/vehicles/${vehicleId}/charging-schedules`);
}

export async function fetchChargingSettings(deviceId: string): Promise<ChargingSettings> {
  return numizAuthFetch<ChargingSettings>(`/devices/${deviceId}/charging-settings`);
}

export async function updateChargingSettings(
  deviceId: string,
  body: UpdateChargingSettingsRequest,
): Promise<ChargingSettings> {
  return numizAuthFetch<ChargingSettings>(`/devices/${deviceId}/charging-settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function fetchInstallerCompanyMe(): Promise<InstallerCompanyMeResponse> {
  return numizAuthFetch<InstallerCompanyMeResponse>("/installer/companies/me");
}

/** Throws {@link NumizForbiddenError} when the user cannot access installer APIs. */
export async function verifyInstallerAccess(): Promise<void> {
  await fetchInstallerCompanyMe();
}

export async function fetchInstallerInstallations(): Promise<InstallationSummary[]> {
  return numizAuthFetch<InstallationSummary[]>("/installer/installations");
}

export async function fetchInstallerInstallation(id: string): Promise<InstallationDetail> {
  return numizAuthFetch<InstallationDetail>(`/installer/installations/${id}`);
}

export async function createInstallerInstallation(
  body: CreateInstallationRequest,
): Promise<InstallationCreateResponse> {
  return numizAuthFetch<InstallationCreateResponse>("/installer/installations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
