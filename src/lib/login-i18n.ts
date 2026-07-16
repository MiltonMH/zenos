import {
  ZENOS_LANG_KEY,
  getStoredLanguage,
  type AppLanguage,
} from "@/lib/i18n-core";
export { ZENOS_LANG_KEY };
export type LoginLanguage = AppLanguage;
export const getLoginLanguage = getStoredLanguage;

const loginTexts = {
  sv: {
    email: "E-post",
    password: "Lösenord",
    emailPlaceholder: "namn@mejl.se",
    passwordPlaceholder: "Lösenord",
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
    welcomeBack: "Välkommen tillbaka",
    createAccountLink: "Inget konto? Skapa ett",
    back: "Tillbaka",
  },
  en: {
    email: "Email",
    password: "Password",
    emailPlaceholder: "name@email.com",
    passwordPlaceholder: "Password",
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
    welcomeBack: "Welcome back",
    createAccountLink: "No account? Create one",
    back: "Back",
  },
} as const;

export type LoginTexts = (typeof loginTexts)[LoginLanguage];

export function getLoginTexts(language: LoginLanguage = getLoginLanguage()): LoginTexts {
  return loginTexts[language];
}
