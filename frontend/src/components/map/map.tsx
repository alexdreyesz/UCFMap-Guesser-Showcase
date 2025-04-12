import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, ZoomControl } from "react-leaflet";

function SchoolMap() {
  const [center, setCenter] = useState<[number, number]>([28.6024, -81.2001]);

  // A child component that subscribes to map events using hooks:
  function HandleMapEvents() {
    const map = useMapEvents({
      moveend: () => {
        const newCenter = map.getCenter();
        setCenter([newCenter.lat, newCenter.lng]);
      },
    });
    return null; // It doesn't render any UI
  }

  return (
    <MapContainer
      zoomControl={false}
      center={center}
      zoom={15}
      style={{ height: "100%", width: "120%" }}
      whenReady={() => {
        console.log("Map is ready (no arguments passed in v4).");
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap Contributors"
      />

      <ZoomControl position="bottomright" />

      <HandleMapEvents />
    </MapContainer>
  );
}

export default SchoolMap;
