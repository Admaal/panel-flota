/**
 * Panel de control de flota: muestra el indicador de estado (EN RUTA / DETENIDO)
 * y los botones de acción principales.
 *
 * @param {{ isSimulating: boolean, onToggle: Function, onReset: Function }} props
 */
export function ControlPanel({ isSimulating, onToggle, onReset }) {
  return (
    <div style={{ padding: "24px", borderBottom: "1px solid #334155" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: "#94a3b8",
            textTransform: "uppercase",
          }}
        >
          Estado de Flota
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: isSimulating ? "#10b981" : "#ef4444",
              boxShadow: isSimulating ? "0 0 10px #10b981" : "none",
            }}
          />
          <span
            style={{
              fontSize: "0.8rem",
              color: isSimulating ? "#10b981" : "#ef4444",
              fontWeight: "600",
            }}
          >
            {isSimulating ? "EN RUTA" : "DETENIDO"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          onClick={onToggle}
          style={{
            backgroundColor: isSimulating ? "transparent" : "#3b82f6",
            color: isSimulating ? "#ef4444" : "#ffffff",
            border: isSimulating ? "1px solid #ef4444" : "1px solid #3b82f6",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isSimulating ? "⏹️ Parar Telemetría" : "▶️ Iniciar Viaje"}
        </button>

        <button
          onClick={onReset}
          disabled={isSimulating}
          style={{
            backgroundColor: "transparent",
            color: isSimulating ? "#475569" : "#cbd5e1",
            border: isSimulating ? "1px solid #334155" : "1px solid #64748b",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "0.9rem",
            cursor: isSimulating ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🔄 Resetear Posición
        </button>
      </div>
    </div>
  );
}
