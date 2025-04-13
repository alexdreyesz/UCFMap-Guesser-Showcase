// GameWindow.tsx
import "./GameWindow.css";
import SchoolMap from "../map/map";
import { useState } from "react";
import { LatLngExpression, LatLng } from "leaflet";

function GameWindow() {
  // marker use state for coodinates
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);

  // submit handler
  const handleSubmit = async () => {
    if (!selectedMarker) {
      alert("choose a spot on the map first.");
      return;
    }

    // payload buildfing
    const payload = {
      latitude: (selectedMarker as LatLng).lat,
      longitude: (selectedMarker as LatLng).lng,
      userID: "",
    };

    try {
      const response = await fetch("http://localhost:80/api/guesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Guess submitted successfully:", data);
      //clear marker
      setSelectedMarker(null);
    } catch (error) {
      console.error("error submitting guess:", error);
    }
  };

  return (
    <>
      <div className="game-window-container">
        <div>
          <div className="text-rounds-container">
            <p>Round 1</p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p>
              <strong>Round 2</strong>
            </p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p>Round 3</p>
          </div>

          <div className="game-window-box-images">
            <div className="box-button-square">
              <button className="box-button-button">+</button>
              <button className="box-button-button">-</button>
            </div>
          </div>
        </div>

        <div>
          <div className="text-ucfmap-container">
            <p className="text-map-container">UCF MAP</p>
          </div>

          <div className="game-window-box-map">
            <SchoolMap selectedMarker={selectedMarker} onMarkerChange={setSelectedMarker} />
          </div>
        </div>
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        SUBMIT
      </button>
    </>
  );
}

export default GameWindow;
