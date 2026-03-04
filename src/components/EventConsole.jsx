/** Devuelve los estilos visuales de una entrada de log según su tipo. */
function getLogStyle(type) {
  switch (type) {
    case "warning":
      return {
        bg: "rgba(239, 68, 68, 0.1)",
        border: "#ef4444",
        text: "#f8fafc",
        label: "⚠️ ALERTA",
      };
    case "success":
      return {
        bg: "rgba(16, 185, 129, 0.1)",
        border: "#10b981",
        text: "#f8fafc",
        label: "✅ SISTEMA",
      };
    default:
      return {
        bg: "rgba(59, 130, 246, 0.1)",
        border: "#3b82f6",
        text: "#f8fafc",
        label: "ℹ️ INFO",
      };
  }
}

/**
 * Consola de eventos en tiempo real. Muestra las entradas del log con
 * colores y etiquetas según el tipo (warning, success, info).
 *
 * @param {{ alertsLog: Array<{id: number, time: string, msg: string, type: string}> }} props
 */
export function EventConsole({ alertsLog }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "20px 24px 10px 24px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: "#94a3b8",
            textTransform: "uppercase",
          }}
        >
          Consola de Eventos
        </h2>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 24px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {alertsLog.length === 0 ? (
          <p
            style={{
              color: "#475569",
              textAlign: "center",
              marginTop: "20px",
              fontSize: "0.9rem",
            }}
          >
            Sistemas listos...
          </p>
        ) : (
          alertsLog.map((log) => {
            const style = getLogStyle(log.type);
            return (
              <div
                key={log.id}
                style={{
                  backgroundColor: style.bg,
                  borderLeft: `4px solid ${style.border}`,
                  padding: "12px",
                  borderRadius: "0 6px 6px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      color: style.border,
                      fontSize: "0.7rem",
                      fontWeight: "800",
                    }}
                  >
                    {style.label}
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.7rem" }}>
                    {log.time}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: style.text,
                    fontSize: "0.85rem",
                    lineHeight: "1.4",
                  }}
                >
                  {log.msg}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
