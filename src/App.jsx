import { useState, useCallback, useEffect, useRef } from "react";
import { useSupabaseRealtime } from "./hooks/useSupabaseRealtime";
import { useSimulation } from "./hooks/useSimulation";
import { Sidebar } from "./components/Sidebar";
import { FleetMap } from "./components/FleetMap";

let logIdCounter = 0;

function App() {
  const [alertsLog, setAlertsLog] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const autoStarted = useRef(false);

  const urlParams = new URLSearchParams(window.location.search);
  const trackingId = urlParams.get("tracking_id");

  const addLog = useCallback((msg, type = "info") => {
    const time = new Date().toLocaleTimeString();
    setAlertsLog((prev) => [{ id: ++logIdCounter, time, msg, type }, ...prev]);
  }, []);

  const { truckPosition, isDeviated, resetPosition, resetDeviation } =
    useSupabaseRealtime(addLog, trackingId);

  const { isSimulating, resumeIndex, toggleSimulation, stopSimulation } =
    useSimulation(addLog, trackingId);

  useEffect(() => {
    if (trackingId && !autoStarted.current) {
      autoStarted.current = true;
      addLog(`Rastreando pedido: ${trackingId.split("-")[0].toUpperCase()}`, "success");
      
      setTimeout(() => {
        toggleSimulation();
      }, 1500);
    }
  }, [trackingId, toggleSimulation, addLog]);

  const handleToggle = () => {
    if (!isSimulating && resumeIndex === 0) {
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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {!sidebarOpen && (
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      <Sidebar
        isSimulating={isSimulating}
        alertsLog={alertsLog}
        onToggle={handleToggle}
        onReset={handleReset}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <FleetMap truckPosition={truckPosition} isDeviated={isDeviated} />
    </div>
  );
}

export default App;