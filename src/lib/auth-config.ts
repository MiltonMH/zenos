export const SSO_SESSION_KEY = "zenos-sso-session";
export const BASIC_SESSION_KEY = "zenos-basic-session";

export type SsoProvider = "google" | "apple";

export interface SsoSession {
  provider: SsoProvider;
  idToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface BasicAuthSession {
  email: string;
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
}

export function readSsoSession(): SsoSession | null {
  try {
    const raw = localStorage.getItem(SSO_SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as SsoSession;
    if (!session.idToken || !session.provider) return null;

    if (session.expiresAt && Date.now() >= session.expiresAt) {
      localStorage.removeItem(SSO_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function writeSsoSession(session: SsoSession): void {
  localStorage.setItem(SSO_SESSION_KEY, JSON.stringify(session));
}

export function clearSsoSession(): void {
  localStorage.removeItem(SSO_SESSION_KEY);
}

export function readBasicSession(): BasicAuthSession | null {
  try {
    const raw = localStorage.getItem(BASIC_SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as BasicAuthSession;
    if (!session.accessToken || !session.refreshToken || !session.email) return null;

    if (Date.now() >= session.refreshExpiresAt) {
      localStorage.removeItem(BASIC_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function writeBasicSession(session: BasicAuthSession): void {
  localStorage.setItem(BASIC_SESSION_KEY, JSON.stringify(session));
}

export function clearBasicSession(): void {
  localStorage.removeItem(BASIC_SESSION_KEY);
}

/** Refresh access token this many ms before hard expiry. */
export const ACCESS_TOKEN_SKEW_MS = 60_000;

export function isBasicSessionAccessValid(
  session: BasicAuthSession,
  skewMs = ACCESS_TOKEN_SKEW_MS,
): boolean {
  return Date.now() < session.accessExpiresAt - skewMs;
}

export function isBasicRefreshValid(session: BasicAuthSession): boolean {
  return Date.now() < session.refreshExpiresAt;
}
