// GameWindow.tsxz
import "./GameWindow.css";
import SchoolMap from "../map/map";
import { useRef, useState } from "react";
import { LatLngExpression, LatLng } from "leaflet";
import geoImage from "../../assets/images/ucf-pegasus-mural.jpg";

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

  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 1)); // prevent scaling below original
    setPosition({ x: 0, y: 0 }); // reset position when zooming out fully
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div className="game-window-container">
        <div>
          <div className="text-rounds-container">
            <p>Round 1</p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p>
              <div className="current-round">Round 2</div>
            </p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p>Round 3</p>
          </div>

          <div
            className="game-window-box-images"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDragStart={(e) => e.preventDefault()}
          >
            <img
              className="geo-image"
              src={geoImage}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "top left",
                transition: isDragging ? "none" : "transform 0.3s ease",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />

            <div className="box-button-square">
              <button className="box-button-button" onClick={handleZoomIn}>
                +
              </button>
              <button className="box-button-button" onClick={handleZoomOut}>
                -
              </button>
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
