// mapmarkers.tsx
import React from "react";
import { Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface MapMarkersProps {
  selectedMarker: LatLngExpression | null;
  correctAnswer: LatLngExpression | null;
  showResult: boolean;
  onMarkerChange: (marker: LatLngExpression | null) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  selectedMarker,
  correctAnswer,
  showResult,
  onMarkerChange,
}) => {
  // Handle user clicks on the map
  useMapEvents({
    click(e) {
      onMarkerChange(e.latlng);
    },
  });

  return (
    <>
      {/* User's guess marker */}
      {selectedMarker && (
        <Marker position={selectedMarker}>
          <Popup>Your guess: {selectedMarker.toString()}</Popup>
        </Marker>
      )}

      {/* Correct answer marker */}
      {showResult && correctAnswer && (
        <Marker position={correctAnswer}>
          <Popup>Correct location</Popup>
        </Marker>
      )}

      {/* Red polyline between guess and correct answer */}
      {showResult && selectedMarker && correctAnswer && (
        <Polyline
          positions={[selectedMarker, correctAnswer]}
          pathOptions={{ color: "red", weight: 3 }}
        />
      )}
    </>
  );
};

export default MapMarkers;
