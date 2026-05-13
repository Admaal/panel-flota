import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { blueIcon, redIcon } from "../constants/mapIcons";
import { SuccessIcon, WarningIcon } from "./Icons";

/** Mapa Leaflet con marcador de posición y banner de alerta. */
export function FleetMap({ truckPosition, isDeviated }) {
  return (
    <div className="map-wrapper">
      {isDeviated && (
        <div className="deviation-banner">
          <WarningIcon size={16} />
          <span>Vehículo fuera de ruta</span>
        </div>
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
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
              }}
            >
              {isDeviated ? (
                <WarningIcon size={14} />
              ) : (
                <SuccessIcon size={14} />
              )}
              {isDeviated ? "Desviado" : "Trayecto nominal"}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
