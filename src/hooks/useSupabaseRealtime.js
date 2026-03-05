import { useEffect, useState } from "react";
import { getSupabase, STARTING_POINT } from "../lib/supabase";

/** Suscripción realtime a la tabla `telemetry` de Supabase. */
export function useSupabaseRealtime(addLog) {
  const [truckPosition, setTruckPosition] = useState(STARTING_POINT);
  const [isDeviated, setIsDeviated] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "telemetry" },
        (payload) => {
          const { lat, lon, is_deviated: deviated } = payload.new;

          // H9: usar != null para no ignorar coordenada 0
          if (lat != null && lon != null) {
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

  const resetPosition = () => {
    setTruckPosition(STARTING_POINT);
    setIsDeviated(false);
  };

  const resetDeviation = () => setIsDeviated(false);

  return { truckPosition, isDeviated, resetPosition, resetDeviation };
}
