/** Indicador de estado y botones de acción de la flota. */
import { PauseIcon, PlayIcon, RefreshIcon } from "./Icons";

export function ControlPanel({ isSimulating, onToggle, onReset }) {
  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <h2 className="control-panel-title">Estado de Flota</h2>
        <div className="status-indicator">
          <div
            className={`status-dot ${isSimulating ? "active" : "inactive"}`}
          />
          <span
            className={`status-label ${isSimulating ? "active" : "inactive"}`}
          >
            {isSimulating ? "EN RUTA" : "DETENIDO"}
          </span>
        </div>
      </div>

      <div className="control-buttons">
        <button
          onClick={onToggle}
          className={`btn-primary ${isSimulating ? "btn-stop" : "btn-start"}`}
        >
          {isSimulating ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          <span>{isSimulating ? "Pausar telemetría" : "Iniciar viaje"}</span>
        </button>

        <button
          onClick={onReset}
          disabled={isSimulating}
          className={`btn-secondary ${isSimulating ? "disabled" : "enabled"}`}
        >
          <RefreshIcon size={16} />
          <span>Resetear posición</span>
        </button>
      </div>
    </div>
  );
}
