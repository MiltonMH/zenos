import {
  clearBasicSession,
  clearSsoSession,
  readBasicSession,
  readSsoSession,
  type BasicAuthSession,
  type SsoProvider,
  type SsoSession,
} from "@/lib/auth-config";

export class NumizAuthError extends Error {
  constructor(message = "UNAUTHORIZED") {
    super(message);
    this.name = "NumizAuthError";
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
