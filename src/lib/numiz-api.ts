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
      return "Inloggning via denna leverantör är inte tillgänglig";
    }
    if (body.message?.includes("token exchange failed")) {
      return "Kunde inte slutföra inloggningen. Försök igen.";
    }
    if (body.message) return body.message;
  } catch {
    // Fall through to generic message.
  }

  return "Något gick fel vid inloggningen";
}

async function numizFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getNumizApiBase()}${path}`, init);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json() as Promise<T>;
}

export async function fetchAuthProviders(): Promise<AuthProvidersResponse> {
  return numizFetch<AuthProvidersResponse>("/auth/providers");
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
  provider: "google" | "apple",
  tokens: OAuthTokenResponse,
) {
  if (!tokens.id_token) {
    throw new Error("Inloggningen returnerade ingen giltig token");
  }

  return {
    provider,
    idToken: tokens.id_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
  };
}
