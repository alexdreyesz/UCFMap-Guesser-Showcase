// map.tsx
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import MapMarkers from "./mapmarkers";
import { LatLngExpression, LatLngBounds, LatLng } from "leaflet";

interface SchoolMapProps {
  selectedMarker: LatLngExpression | null;
  onMarkerChange: (marker: LatLngExpression | null) => void;
  correctAnswer: LatLngExpression | null;
  showResult: boolean;
}

function SchoolMap({ selectedMarker, onMarkerChange, correctAnswer, showResult }: SchoolMapProps) {
  const [center, setCenter] = useState<[number, number]>([28.6024, -81.2001]);

  // zoom out so that both points appear after answer appears
  function AutoZoomOnResult() {
    const map = useMap();

    useEffect(() => {
      if (showResult && selectedMarker && correctAnswer) {
        let point1: LatLng;
        let point2: LatLng;

        // Convert LatLngExpression to a standard LatLng object
        const toLatLng = (input: LatLngExpression) =>
          Array.isArray(input)
            ? new LatLng(input[0], input[1])
            : new LatLng((input as any).lat, (input as any).lng);

        point1 = toLatLng(selectedMarker);
        point2 = toLatLng(correctAnswer);

        const bounds = new LatLngBounds([point1, point2]);
        map.fitBounds(bounds.pad(0.25));
      }
    }, [showResult, selectedMarker, correctAnswer, map]);

    return null;
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

      <AutoZoomOnResult />

      <MapMarkers
        selectedMarker={selectedMarker}
        onMarkerChange={onMarkerChange}
        correctAnswer={correctAnswer}
        showResult={showResult}
      />
    </MapContainer>
  );
}

export default SchoolMap;
