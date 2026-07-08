export const ZENION_LANG_KEY = "zenion-lang";

export type LoginLanguage = "sv" | "en";

const loginTexts = {
  sv: {
    email: "E-post",
    password: "Lösenord",
    emailPlaceholder: "namn@foretag.se",
    passwordPlaceholder: "••••••••",
    showPassword: "Visa lösenord",
    hidePassword: "Dölj lösenord",
    signIn: "Logga in",
    signingIn: "Loggar in…",
    or: "eller",
    continueWithGoogle: "Fortsätt med Google",
    continueWithApple: "Fortsätt med Apple",
    footer: "Kontakta Zenion för att få ett konto",
    invalidCredentials: "Felaktigt e-post eller lösenord",
    ssoStartFailed: "Kunde inte starta inloggningen",
    providerNotAvailable: "Inloggning via denna leverantör är inte tillgänglig",
  },
  en: {
    email: "Email",
    password: "Password",
    emailPlaceholder: "name@company.com",
    passwordPlaceholder: "••••••••",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    or: "or",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
    footer: "Contact Zenion to get an account",
    invalidCredentials: "Invalid email or password",
    ssoStartFailed: "Could not start sign-in",
    providerNotAvailable: "Sign-in via this provider is not available",
  },
} as const;

export type LoginTexts = (typeof loginTexts)[LoginLanguage];

export function getLoginLanguage(): LoginLanguage {
  try {
    const stored = localStorage.getItem(ZENION_LANG_KEY)?.trim().toLowerCase();
    if (stored === "en" || stored === "english" || stored?.startsWith("en-")) {
      return "en";
    }
  } catch {
    // Ignore storage errors.
  }

  return "sv";
}

export function getLoginTexts(language: LoginLanguage = getLoginLanguage()): LoginTexts {
  return loginTexts[language];
}
