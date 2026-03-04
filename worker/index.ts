export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

/** Cabeceras CORS que se incluyen en todas las respuestas. */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** Helper para construir respuestas JSON con CORS y status code explícito. */
function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // --- CORS preflight ---
    // El navegador envía OPTIONS antes de la petición real en requests cross-origin.
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method Not Allowed" }, 405);
    }

    // --- Parseo y validación del payload ---
    let payload: {
      truck_id?: unknown;
      location?: { lat?: unknown; lon?: unknown };
      timestamp?: unknown;
    };
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
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
      );
    }

    // --- Inserción en Supabase ---
    const supabaseResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/telemetry`,
      {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal", // evita que Supabase devuelva la fila completa
        },
        body: JSON.stringify({
          truck_id,
          lat: location.lat,
          lon: location.lon,
          timestamp,
        }),
      },
    );

    // --- Verificación de la respuesta de Supabase ---
    if (!supabaseResponse.ok) {
      const errorBody = await supabaseResponse.text();
      console.error(
        `[worker] Supabase insert failed (${supabaseResponse.status}):`,
        errorBody,
      );
      return jsonResponse(
        { error: "Database insert failed", detail: errorBody },
        502,
      );
    }

    return jsonResponse({ success: true }, 200);
  },
};
