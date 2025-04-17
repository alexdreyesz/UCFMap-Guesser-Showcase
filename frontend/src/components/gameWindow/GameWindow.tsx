// GameWindow.tsx
import "./GameWindow.css";
import SchoolMap from "../map/map";
import React, { useRef, useEffect, useState } from "react";
import L, { LatLngExpression, LatLng } from "leaflet";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import imagePlaceHolder from "../../assets/icons/no-image-icon.png";
import { set } from "mongoose";
import { ReturnOriginalZoom } from "../map/map"; // assuming file is map.tsx


function GameWindow() {
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<LatLngExpression | null>(null);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [geoImage, setGeoImage] = React.useState(imagePlaceHolder);
  const [globalScore, setGlobalScore] = useState(0);
  const [resetZoomTrigger, setResetZoomTrigger] = useState(false);


  interface Treasure {
    id?: string;
    location: {
      longitude: number;
      latitude: number;
    };
    imageURL: string;
    authorId: string;
  }

  const [treasure, setTreasure] = useState<Treasure | null>(null);
  const [error, setError] = useState<string>("");

  // Fetch Random Treasure
  const fetchRandomTreasure = async () => {
    try {
      const response = await fetch("/api/treasures/random");

      if (!response.ok) {
        throw new Error("Failed to fetch treasure");
      }

      const data: Treasure = await response.json();

      console.log("New treasure loaded:", data);

      setGeoImage(data.imageURL);

      setCorrectAnswer([data.location.latitude, data.location.longitude]);
      
      console.log("Correct Answer: Fetch: " + correctAnswer);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    }
  };

   // Fetch Random Treasure On Page Load
   useEffect(() => {
     fetchRandomTreasure();
   }, []);

  // score formula
  function calculateScore(distanceMeters: number): number {
    const maxScore = 5000;
    const decayFactor = 150;
    return Math.max(0, Math.round(maxScore * Math.exp(-distanceMeters / decayFactor)));
  }
  
  function returnOriginalZoom() {
    setResetZoomTrigger(true);
    setTimeout(() => {
      setResetZoomTrigger(false); // reset the flag after it's triggered
    }, 1000);
  }

  const handleSubmit = async () => {
    console.log("Correct Answer: Handle: " + correctAnswer);
    if (!selectedMarker) {
      alert("Choose a spot on the map first.");
      return;
    }

    if (!correctAnswer) {
      alert("Correct answer not loaded yet.");
      return;
    }

    returnOriginalZoom();

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

    console.log(calculatedScore);

    setGlobalScore((prevScore) => {
      const updatedScore = prevScore + calculatedScore;
      console.log("New score:", updatedScore);
      setScore(updatedScore);
      return updatedScore;
    });

    setShowResult(true);

    setTimeout(() => {
      setCorrectAnswer(null);
      setSelectedMarker(null);
      returnOriginalZoom();
      setShowResult(false);
      fetchRandomTreasure();
    }, 3000);
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

  const [round, setRound] = useState(1);

  function nextRound() {
    setRound((prev) => {
      if (prev === 3) {
        setGlobalScore(0);
        setScore(0);
        setDistance(0);
        return 1;
      }

      return prev + 1;
    });
  }

  const [isDisabled, setIsDisabled] = useState(false);

  const handleButtonClick = () => {
    setIsDisabled(true);
    handleSubmit();
    setTimeout(() => { setIsDisabled(false); nextRound();}, 3000);
  };


  return (
    <>
      <div className="game-window-container">
        <div>
          <div className="game-text-rounds-container">
            <p className={round === 1 ? "round-1 current-round" : "round-1"}>Round 1</p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p className={round === 2 ? "round-2 current-round" : "round-2"}>Round 2</p>
            <p>&nbsp;&nbsp;|&nbsp;&nbsp;</p>
            <p className={round === 3 ? "round-3 current-round" : "round-3"}>Round 3</p>
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
          <div className="game-text-ucfmap-container">
            <p className="game-text-map-container">UCF MAP</p>
          </div>

          <div className="game-window-box-map">
            <SchoolMap
              selectedMarker={selectedMarker}
              onMarkerChange={setSelectedMarker}
              correctAnswer={correctAnswer}
              showResult={showResult}
              resetZoomTrigger={resetZoomTrigger}
            />
          </div>
        </div>
      </div>

      <div className="game-botton-container">
        <button
          className="game-submit-button"
          disabled={isDisabled}
          onClick={handleButtonClick}
        >
          SUBMIT
        </button>

        <div className="distance-result">
          <p>
            Distance: <strong>{(distance / 1000).toFixed(2)} km</strong>
          </p>
          <p>
            Your Score: <strong>{score}</strong>
          </p>
        </div>
      </div>
    </>
  );
}

export default GameWindow;
