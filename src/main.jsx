import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/**
 * Error Boundary that intercepts errors thrown during render (e.g., missing env vars)
 * and displays a helpful, styled screen instead of a blank white page.
 * Class components are required by React for Error Boundaries.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#0f172a",
            fontFamily: "Inter, system-ui, sans-serif",
            padding: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #ef4444",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "1.75rem" }}>⚙️</span>
              <div>
                <h1
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                  }}
                >
                  Error de configuración
                </h1>
                <p
                  style={{
                    margin: "2px 0 0 0",
                    color: "#94a3b8",
                    fontSize: "0.8rem",
                  }}
                >
                  NexusLogistics · panel-flota
                </p>
              </div>
            </div>

            <pre
              style={{
                backgroundColor: "#0f172a",
                borderRadius: "8px",
                padding: "16px",
                color: "#f87171",
                fontSize: "0.82rem",
                lineHeight: "1.8",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: "0 0 20px 0",
                border: "1px solid #334155",
              }}
            >
              {this.state.error.message}
            </pre>

            <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>
              La aplicación no puede iniciarse sin estas variables. Consulta el{" "}
              <code
                style={{
                  color: "#94a3b8",
                  backgroundColor: "#0f172a",
                  padding: "1px 5px",
                  borderRadius: "4px",
                }}
              >
                README.md
              </code>{" "}
              para más información.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
