export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  API_KEY?: string; // H13: API key para autenticar clientes
}

// H11: CORS restringido al dominio de producción
const ALLOWED_ORIGINS = [
  "https://panel-flota.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
];

// H12: Rate limiting en memoria (por IP, 30 peticiones/minuto)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
  };
}

function jsonResponse(body: unknown, status: number, corsHeaders: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = getCorsHeaders(request);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method Not Allowed" }, 405, corsHeaders);
    }

    // H13: Validar API key si está configurada
    if (env.API_KEY) {
      const clientKey = request.headers.get("X-API-Key");
      if (clientKey !== env.API_KEY) {
        return jsonResponse({ error: "Unauthorized" }, 401, corsHeaders);
      }
    }

    // H12: Rate limiting por IP
    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(clientIp)) {
      return jsonResponse({ error: "Too Many Requests" }, 429, corsHeaders);
    }

    // Parseo y validación del payload
    let payload: {
      truck_id?: unknown;
      location?: { lat?: unknown; lon?: unknown };
      timestamp?: unknown;
    };
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, corsHeaders);
    }

    const { truck_id, location, timestamp } = payload;

    if (
      typeof truck_id !== "string" ||
      !truck_id ||
      typeof location?.lat !== "number" ||
      typeof location?.lon !== "number" ||
      typeof timestamp !== "string"
    ) {
      return jsonResponse(
        {
          error:
            "Missing or invalid fields. Required: truck_id (string), location.lat (number), location.lon (number), timestamp (string)",
        },
        400,
        corsHeaders,
      );
    }

    // Inserción en Supabase
    const supabaseResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/telemetry`,
      {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          truck_id,
          lat: location.lat,
          lon: location.lon,
          timestamp,
        }),
      },
    );

    if (!supabaseResponse.ok) {
      const errorBody = await supabaseResponse.text();
      console.error(`[worker] Supabase insert failed (${supabaseResponse.status}):`, errorBody);
      return jsonResponse({ error: "Database insert failed" }, 502, corsHeaders);
    }

    return jsonResponse({ success: true }, 200, corsHeaders);
  },
};
