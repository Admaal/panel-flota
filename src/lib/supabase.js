import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Lazy init: evita crear el cliente antes de que validateEnv() pueda validar.
let _supabase = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }
  return _supabase;
}

export const STARTING_POINT = [39.8641, -4.0226]; // Toledo
