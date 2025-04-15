// GameWindow.tsx
import "./GameWindow.css";
import SchoolMap from "../map/map";
import { useRef, useEffect, useState } from "react";
import L, { LatLngExpression, LatLng } from "leaflet";
import geoImage from "../../assets/images/ucf-pegasus-mural.jpg";

function GameWindow() {
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<LatLngExpression | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // async function loadTreasure() {
    //   try {
    //     const response = await fetch("http://localhost:80/api/treasure/random");
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     const data = await response.json();
    //     setCorrectAnswer([data.location.latitude, data.location.longitude]);
    //     console.log("Correct answer:", data.location.latitude, data.location.longitude);
    //   } catch (error) {
    //     console.error("Error fetching correct answer:", error);
    //   }
    // }

    // loadTreasure();
    //test
    setCorrectAnswer([28.6024, -81.2001]);
  }, []);

  // score formula
  function calculateScore(distanceMeters: number): number {
    const maxScore = 5000;
    const decayFactor = 150;
    return Math.max(0, Math.round(maxScore * Math.exp(-distanceMeters / decayFactor)));
  }

  const handleSubmit = async () => {
    if (!selectedMarker) {
      alert("Choose a spot on the map first.");
      return;
    }

    if (!correctAnswer) {
      alert("Correct answer not loaded yet.");
      return;
    }

    //convert to Leaflet objects////
    let userLatLng: L.LatLng;
    if (Array.isArray(selectedMarker)) {
      userLatLng = L.latLng(selectedMarker[0], selectedMarker[1]);
    } else if ("lat" in selectedMarker && "lng" in selectedMarker) {
      userLatLng = L.latLng(selectedMarker.lat, selectedMarker.lng);
    } else {
      console.error("Invalid selectedMarker format", selectedMarker);
      return;
    }
    let correctLatLng: L.LatLng;
    if (Array.isArray(correctAnswer)) {
      correctLatLng = L.latLng(correctAnswer[0], correctAnswer[1]);
    } else if ("lat" in correctAnswer && "lng" in correctAnswer) {
      correctLatLng = L.latLng(correctAnswer.lat, correctAnswer.lng);
    } else {
      console.error("Invalid correctAnswer format", correctAnswer);
      return;
    }
    /////////////////////////////////////////////////
    const calculatedDistance = userLatLng.distanceTo(correctLatLng);
    setDistance(calculatedDistance);

    const calculatedScore = calculateScore(calculatedDistance);
    setScore(calculatedScore);

    setShowResult(true);

    // Send to backend (optional)
    const payload = {
      latitude: userLatLng.lat,
      longitude: userLatLng.lng,
      userID: "", // add this if you track users
    };

    try {
      const response = await fetch("http://localhost:80/api/guesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Guess submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting guess:", error);
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
              <strong>Round 2</strong>
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
            <SchoolMap
              selectedMarker={selectedMarker}
              onMarkerChange={setSelectedMarker}
              correctAnswer={correctAnswer}
              showResult={showResult}
            />
          </div>
        </div>
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        SUBMIT
      </button>

      {showResult && distance !== null && (
        <div className="distance-result">
          <p>
            You were <strong>{(distance / 1000).toFixed(2)} km</strong> away.
          </p>
          <p>
            You earned <strong>{score}</strong> points!
          </p>
        </div>
      )}
    </>
  );
}

export default GameWindow;
