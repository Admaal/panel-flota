import { useState, useCallback } from "react";
import { validateEnv } from "./lib/env";
import { useSupabaseRealtime } from "./hooks/useSupabaseRealtime";
import { useSimulation } from "./hooks/useSimulation";
import { Sidebar } from "./components/Sidebar";
import { FleetMap } from "./components/FleetMap";

function App() {
  // Lanza un error descriptivo si falta alguna variable de entorno.
  // El Error Boundary en main.jsx lo captura y muestra una pantalla útil.
  validateEnv();

  const [alertsLog, setAlertsLog] = useState([]);

  // useCallback garantiza que `addLog` sea estable entre renders,
  // evitando que el useEffect de useSupabaseRealtime se ejecute en bucle.
  const addLog = useCallback((msg, type = "info") => {
    const time = new Date().toLocaleTimeString();
    setAlertsLog((prev) => [{ id: Date.now(), time, msg, type }, ...prev]);
  }, []);

  const { truckPosition, isDeviated, resetPosition, resetDeviation } =
    useSupabaseRealtime(addLog);

  const { isSimulating, toggleSimulation, stopSimulation } =
    useSimulation(addLog);

  const handleToggle = () => {
    // Al iniciar un nuevo viaje, limpiamos el log y el estado de desvío previo.
    if (!isSimulating) {
      setAlertsLog([]);
      resetDeviation();
    }
    toggleSimulation();
  };

  const handleReset = () => {
    stopSimulation();
    resetPosition();
    setAlertsLog([]);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#0f172a",
      }}
    >
      <Sidebar
        isSimulating={isSimulating}
        alertsLog={alertsLog}
        onToggle={handleToggle}
        onReset={handleReset}
      />
      <FleetMap truckPosition={truckPosition} isDeviated={isDeviated} />
    </div>
  );
}

export default App;
