import { ControlPanel } from "./ControlPanel";
import { EventConsole } from "./EventConsole";

/**
 * Barra lateral corporativa. Compone la cabecera de marca, el panel de control
 * y la consola de eventos.
 *
 * @param {{ isSimulating: boolean, alertsLog: Array, onToggle: Function, onReset: Function }} props
 */
export function Sidebar({ isSimulating, alertsLog, onToggle, onReset }) {
  return (
    <div
      style={{
        width: "360px",
        backgroundColor: "#1e293b",
        borderRight: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      {/* Cabecera con Logo */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid #334155",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#3b82f6",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 12V9h2.3l2.32 3H17z" />
          </svg>
        </div>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#f8fafc",
              letterSpacing: "-0.5px",
            }}
          >
            Nexus<span style={{ color: "#3b82f6" }}>Logistics</span>
          </h1>
          <p
            style={{
              margin: "2px 0 0 0",
              fontSize: "0.75rem",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Control Central
          </p>
        </div>
      </div>

      <ControlPanel
        isSimulating={isSimulating}
        onToggle={onToggle}
        onReset={onReset}
      />

      <EventConsole alertsLog={alertsLog} />
    </div>
  );
}
