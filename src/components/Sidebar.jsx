import { ControlPanel } from "./ControlPanel";
import { EventConsole } from "./EventConsole";

/** Barra lateral. En móvil actúa como drawer con la clase `.open`. */
export function Sidebar({ isSimulating, alertsLog, onToggle, onReset, isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 12V9h2.3l2.32 3H17z" />
          </svg>
        </div>
        <div>
          <h1 className="sidebar-title">
            Nexus<span style={{ color: "#3b82f6" }}>Logistics</span>
          </h1>
          <p className="sidebar-subtitle">Control Central</p>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Cerrar menú">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <ControlPanel
        isSimulating={isSimulating}
        onToggle={onToggle}
        onReset={onReset}
      />

      <EventConsole alertsLog={alertsLog} />
    </aside>
  );
}
