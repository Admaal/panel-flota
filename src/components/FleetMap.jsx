import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { blueIcon, redIcon } from "../constants/mapIcons";

/**
 * Renderiza el mapa Leaflet con el marcador de posición del vehículo.
 * Muestra un banner de alerta flotante cuando el camión está fuera de ruta.
 *
 * @param {{ truckPosition: number[], isDeviated: boolean }} props
 */
export function FleetMap({ truckPosition, isDeviated }) {
  return (
    <div style={{ flex: 1, position: "relative" }}>
      {isDeviated && (
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            backgroundColor: "#ef4444",
            color: "white",
            padding: "12px 24px",
            borderRadius: "30px",
            fontWeight: "700",
            boxShadow: "0 10px 25px rgba(239,68,68,0.4)",
          }}
        >
          ⚠️ VEHÍCULO FUERA DE RUTA
        </div>
      )}
      <MapContainer
        center={[38.5, -4.0]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={truckPosition} icon={isDeviated ? redIcon : blueIcon}>
          <Popup>
            <strong>Vehículo NEXUS-1</strong>
            <br />
            {isDeviated ? "⚠️ Desviado" : "✅ Trayecto Nominal"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
