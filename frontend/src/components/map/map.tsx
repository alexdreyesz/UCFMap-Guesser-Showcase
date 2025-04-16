// map.tsx
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import MapMarkers from "./mapmarkers";
import { LatLngExpression, LatLngBounds, LatLng } from "leaflet";
import L from "leaflet";

//marker should now stay on site
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface SchoolMapProps {
  selectedMarker: LatLngExpression | null;
  onMarkerChange: (marker: LatLngExpression | null) => void;
  correctAnswer: LatLngExpression | null;
  showResult: boolean;
}

function SchoolMap({ selectedMarker, onMarkerChange, correctAnswer, showResult }: SchoolMapProps) {
  const [center, setCenter] = useState<[number, number]>([28.6024, -81.2001]);

  function AutoZoomOnResult() {
    const map = useMap();

    useEffect(() => {
      if (showResult && selectedMarker && correctAnswer) {
        const toLatLng = (input: LatLngExpression): LatLng =>
          Array.isArray(input)
            ? new LatLng(input[0], input[1])
            : new LatLng((input as any).lat, (input as any).lng);

        const point1 = toLatLng(selectedMarker);
        const point2 = toLatLng(correctAnswer);

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
