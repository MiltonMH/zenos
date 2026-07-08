export const AUTH_STORAGE_KEY = "zenos-auth";

export const HARDCODED_EMAIL = "max@example.com";
export const HARDCODED_PASSWORD = "zenos123";

export function validateCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === HARDCODED_EMAIL.toLowerCase() &&
    password === HARDCODED_PASSWORD
  );
}
