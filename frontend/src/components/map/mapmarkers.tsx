// mapmarkers.tsx
import React from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface MapMarkersProps {
  selectedMarker: LatLngExpression | null;
  onMarkerChange: (marker: LatLngExpression | null) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ selectedMarker, onMarkerChange }) => {
  // Listen for clicks on the map.
  useMapEvents({
    click(e) {
      // On click, update the marker to the clicked location.
      onMarkerChange(e.latlng);
    },
  });

  return (
    <>
      {selectedMarker && (
        <Marker position={selectedMarker}>
          <Popup>Your selected location: {selectedMarker.toString()}</Popup>
        </Marker>
      )}
    </>
  );
};

export default MapMarkers;
