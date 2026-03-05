function getLogStyle(type) {
  switch (type) {
    case "warning":
      return { bg: "rgba(239, 68, 68, 0.1)", border: "#ef4444", color: "#ef4444", label: "⚠️ ALERTA" };
    case "success":
      return { bg: "rgba(16, 185, 129, 0.1)", border: "#10b981", color: "#10b981", label: "✅ SISTEMA" };
    default:
      return { bg: "rgba(59, 130, 246, 0.1)", border: "#3b82f6", color: "#3b82f6", label: "ℹ️ INFO" };
  }
}

/** Consola de eventos en tiempo real. */
export function EventConsole({ alertsLog }) {
  return (
    <div className="event-console">
      <div className="event-console-header">
        <h2 className="event-console-title">Consola de Eventos</h2>
      </div>

      <div className="event-console-list">
        {alertsLog.length === 0 ? (
          <p className="event-empty">Sistemas listos...</p>
        ) : (
          alertsLog.map((log) => {
            const s = getLogStyle(log.type);
            return (
              <div
                key={log.id}
                className="event-item"
                style={{
                  backgroundColor: s.bg,
                  borderLeft: `4px solid ${s.border}`,
                }}
              >
                <div className="event-item-header">
                  <span className="event-label" style={{ color: s.color }}>
                    {s.label}
                  </span>
                  <span className="event-time">{log.time}</span>
                </div>
                <p className="event-msg">{log.msg}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
