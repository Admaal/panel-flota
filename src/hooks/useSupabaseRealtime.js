import { useEffect, useState } from "react";
import { supabase, STARTING_POINT } from "../lib/supabase";

/**
 * Hook que gestiona la suscripción en tiempo real a la tabla `telemetry` de Supabase.
 * Recibe un callback `addLog` para emitir eventos hacia la consola de la UI.
 *
 * @param {Function} addLog - Callback para añadir entradas a la consola de eventos.
 * @returns {{ truckPosition: number[], isDeviated: boolean, resetPosition: Function, resetDeviation: Function }}
 */
export function useSupabaseRealtime(addLog) {
  const [truckPosition, setTruckPosition] = useState(STARTING_POINT);
  const [isDeviated, setIsDeviated] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "telemetry" },
        (payload) => {
          const { lat, lon, is_deviated: deviated } = payload.new;

          if (lat && lon) {
            setTruckPosition([lat, lon]);
            setIsDeviated(deviated);

            if (deviated) {
              addLog(
                `Desvío crítico detectado (>2000m) en [${lat.toFixed(2)}, ${lon.toFixed(2)}]`,
                "warning",
              );
            }
          }
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [addLog]);

  /** Vuelve el marcador a Toledo y limpia el estado de desvío. */
  const resetPosition = () => {
    setTruckPosition(STARTING_POINT);
    setIsDeviated(false);
  };

  /** Solo limpia el flag de desvío, sin mover el marcador (útil al iniciar un nuevo viaje). */
  const resetDeviation = () => setIsDeviated(false);

  return { truckPosition, isDeviated, resetPosition, resetDeviation };
}
