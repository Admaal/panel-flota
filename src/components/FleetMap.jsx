import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { blueIcon, redIcon } from "../constants/mapIcons";

/** Mapa Leaflet con marcador de posición y banner de alerta. */
export function FleetMap({ truckPosition, isDeviated }) {
  return (
    <div className="map-wrapper">
      {isDeviated && (
        <div className="deviation-banner">⚠️ VEHÍCULO FUERA DE RUTA</div>
      )}
      <MapContainer
        center={[38.5, -4.0]}
        zoom={7}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ZoomControl position="bottomright" />
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
