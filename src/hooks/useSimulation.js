import { useState, useRef } from "react";
import rutaData from "../ruta_toledo_peligros.json";
import { env } from "../lib/env";

const CLOUDFLARE_URL = env.CLOUDFLARE_URL;
const TRUCK_ID = env.TRUCK_ID;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Número máximo de reintentos antes de notificar al usuario. */
const MAX_RETRIES = 3;

/**
 * Realiza un fetch con reintentos y backoff exponencial.
 * Verifica `response.ok` y lanza un error si el servidor responde con 4xx/5xx.
 *
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} retries - Número máximo de intentos (por defecto MAX_RETRIES).
 * @returns {Promise<Response>}
 * @throws {Error} Tras agotar todos los reintentos.
 */
async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) return response;

      // El servidor respondió con un error HTTP (4xx / 5xx)
      const error = new Error(`HTTP ${response.status} ${response.statusText}`);
      if (attempt === retries) throw error;
    } catch (err) {
      // Captura tanto errores de red (TypeError: Failed to fetch)
      // como los errores HTTP relanzados en la iteración anterior.
      if (attempt === retries) throw err;
    }

    // Backoff exponencial: 1 s → 2 s → 4 s
    const backoff = 1000 * Math.pow(2, attempt - 1);
    await sleep(backoff);
  }
}

/**
 * Hook que gestiona el simulador de viaje: recorre las coordenadas de la ruta
 * y envía pings al Cloudflare Worker en cada paso.
 *
 * @param {Function} addLog - Callback para emitir eventos hacia la consola de la UI.
 * @returns {{ isSimulating: boolean, toggleSimulation: Function, stopSimulation: Function }}
 */
export function useSimulation(addLog) {
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef(false);

  const toggleSimulation = async () => {
    if (isSimulating) {
      setIsSimulating(false);
      simulationRef.current = false;
      addLog("Viaje cancelado por el operador.", "info");
      return;
    }

    setIsSimulating(true);
    simulationRef.current = true;

    addLog("🚀 Telemetría activada. Viaje iniciado desde Toledo.", "success");

    const coordenadas = rutaData.features[0].geometry.coordinates;

    for (let i = 0; i < coordenadas.length; i++) {
      if (!simulationRef.current) break;

      const [lon, lat] = coordenadas[i];
      const pingLabel = `Ping ${i + 1}/${coordenadas.length}`;

      try {
        await fetchWithRetry(CLOUDFLARE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            truck_id: TRUCK_ID,
            location: { lon, lat },
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        // Tras agotar reintentos, notificamos al usuario en la consola de eventos
        addLog(
          `${pingLabel} — Error de red tras ${MAX_RETRIES} intentos: ${error.message}`,
          "warning",
        );
        console.error(`[useSimulation] ${pingLabel} fallido:`, error);
      }

      if (i === coordenadas.length - 1) {
        addLog(
          "🏁 Destino alcanzado: Peligros (Granada). Vehículo estacionado.",
          "success",
        );
      }

      await sleep(2000);
    }

    setIsSimulating(false);
    simulationRef.current = false;
  };

  /** Detiene la simulación sin log adicional (para uso programático, p.ej. reset). */
  const stopSimulation = () => {
    setIsSimulating(false);
    simulationRef.current = false;
  };

  return { isSimulating, toggleSimulation, stopSimulation };
}
