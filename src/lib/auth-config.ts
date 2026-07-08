export const AUTH_STORAGE_KEY = "zenos-auth";
export const SSO_SESSION_KEY = "zenos-sso-session";

export const HARDCODED_EMAIL = "max@example.com";
export const HARDCODED_PASSWORD = "zenos123";

export type SsoProvider = "google" | "apple";

export interface SsoSession {
  provider: SsoProvider;
  idToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export function validateCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === HARDCODED_EMAIL.toLowerCase() &&
    password === HARDCODED_PASSWORD
  );
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

export function hasHardcodedAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}
