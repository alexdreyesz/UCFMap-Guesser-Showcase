import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
      center={center}
      zoom={16}
      style={{ height: "50vh", width: "50%" }}
      whenReady={() => {
        console.log("Map is ready (no arguments passed in v4).");
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <HandleMapEvents />
    </MapContainer>
  );
}

export default SchoolMap;
