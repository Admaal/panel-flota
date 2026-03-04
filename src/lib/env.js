/** Centralized access point for all required environment variables. */
export const env = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  CLOUDFLARE_URL: import.meta.env.VITE_CLOUDFLARE_URL,
  TRUCK_ID: import.meta.env.VITE_TRUCK_ID,
};

/** Maps internal keys to their .env variable name for readable error messages. */
const VAR_NAMES = {
  SUPABASE_URL: "VITE_SUPABASE_URL",
  SUPABASE_ANON_KEY: "VITE_SUPABASE_ANON_KEY",
  CLOUDFLARE_URL: "VITE_CLOUDFLARE_URL",
  TRUCK_ID: "VITE_TRUCK_ID",
};

/**
 * Validates that all required environment variables are defined.
 *
 * Call this at the very start of the App component render so React's Error Boundary
 * can catch the error and display a helpful, styled message instead of a white screen.
 *
 * @throws {Error} If one or more required variables are missing.
 */
export function validateEnv() {
  const missing = Object.entries(VAR_NAMES)
    .filter(([key]) => !env[key])
    .map(([, varName]) => varName);

  if (missing.length === 0) return;

  throw new Error(
    `Faltan ${missing.length} variable(s) de entorno requerida(s):\n\n` +
      missing.map((v) => `  • ${v}`).join("\n") +
      '\n\nCopia ".env.example" a ".env" y rellena los valores.',
  );
}
