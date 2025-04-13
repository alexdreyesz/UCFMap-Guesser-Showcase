// map.tsx
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, ZoomControl } from "react-leaflet";
import MapMarkers from "./mapmarkers";
import { LatLngExpression } from "leaflet";

interface SchoolMapProps {
  selectedMarker: LatLngExpression | null;
  onMarkerChange: (marker: LatLngExpression | null) => void;
}

function SchoolMap({ selectedMarker, onMarkerChange }: SchoolMapProps) {
  const [center, setCenter] = useState<[number, number]>([28.6024, -81.2001]);

  // This component updates the center state when the map has finished moving.
  function HandleMapEvents() {
    useMapEvents({
      moveend: (e) => {
        const newCenter = e.target.getCenter();
        setCenter([newCenter.lat, newCenter.lng]);
      },
    });
    return null; // It doesn’t render any UI.
  }

  return (
    <MapContainer
      zoomControl={false}
      center={center}
      zoom={15}
      style={{ height: "100%", width: "120%" }}
      whenReady={() => console.log("Map is ready.")}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap Contributors"
      />
      <ZoomControl position="bottomright" />

      {/* Render the marker component; this handles clicks and renders one marker */}
      <MapMarkers selectedMarker={selectedMarker} onMarkerChange={onMarkerChange} />

      <HandleMapEvents />
    </MapContainer>
  );
}

export default SchoolMap;
