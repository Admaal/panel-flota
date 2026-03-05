import { useState, useRef } from "react";
import rutaData from "../ruta_toledo_peligros.json";
import { env } from "../lib/env";

const CLOUDFLARE_URL = env.CLOUDFLARE_URL;
const TRUCK_ID = env.TRUCK_ID;
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      const error = new Error(`HTTP ${response.status} ${response.statusText}`);
      if (attempt === retries) throw error;
    } catch (err) {
      if (attempt === retries) throw err;
    }
    await sleep(1000 * Math.pow(2, attempt - 1));
  }
}

/** Simulador de viaje con soporte de pausa y reanudación. */
export function useSimulation(addLog) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [resumeIndex, setResumeIndex] = useState(0);
  const simulationRef = useRef(false);
  const currentIndexRef = useRef(0); // índice actual en la ruta

  const toggleSimulation = async () => {
    // Pausar
    if (simulationRef.current) {
      simulationRef.current = false;
      setIsSimulating(false);
      setResumeIndex(currentIndexRef.current);
      addLog("Viaje pausado por el operador.", "info");
      return;
    }

    // Iniciar o reanudar
    setIsSimulating(true);
    simulationRef.current = true;

    const coordenadas = rutaData.features[0].geometry.coordinates;
    const startIndex = currentIndexRef.current;

    if (startIndex === 0) {
      addLog("🚀 Telemetría activada. Viaje iniciado desde Toledo.", "success");
    } else {
      addLog(`▶️ Viaje reanudado desde el punto ${startIndex + 1}/${coordenadas.length}.`, "info");
    }

    for (let i = startIndex; i < coordenadas.length; i++) {
      currentIndexRef.current = i;
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
        addLog(
          `${pingLabel} — Error de red tras ${MAX_RETRIES} intentos: ${error.message}`,
          "warning",
        );
        console.error(`[useSimulation] ${pingLabel} fallido:`, error);
      }

      if (i === coordenadas.length - 1) {
        addLog("🏁 Destino alcanzado: Peligros (Granada). Vehículo estacionado.", "success");
        currentIndexRef.current = 0;
        setResumeIndex(0);
      }

      await sleep(2000);
    }

    setIsSimulating(false);
    simulationRef.current = false;
  };

  /** Detiene y resetea el índice al inicio (para el botón Resetear). */
  const stopSimulation = () => {
    simulationRef.current = false;
    setIsSimulating(false);
    currentIndexRef.current = 0;
    setResumeIndex(0);
  };

  return { isSimulating, resumeIndex, toggleSimulation, stopSimulation };
}
