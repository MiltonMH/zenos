import type { SsoProvider } from "@/lib/auth-config";

const OAUTH_STATE_KEY = "zenos-oauth-state";

export function getRedirectUri(provider: SsoProvider): string {
  return `${window.location.origin}/auth/callback/${provider}`;
}

export function generateOAuthState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function storeOAuthState(state: string): void {
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
}

export function verifyOAuthState(state: string | null): boolean {
  if (!state) return false;

  const stored = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  return stored === state;
}

export function buildGoogleAuthUrl(clientId: string, state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function buildAppleAuthUrl(clientId: string, state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "name email",
    response_mode: "query",
    state,
  });

  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
}
