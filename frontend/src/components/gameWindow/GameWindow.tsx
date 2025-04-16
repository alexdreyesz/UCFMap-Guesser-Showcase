// GameWindow.tsx
import "./GameWindow.css";
import SchoolMap from "../map/map";
import { useRef, useEffect, useState } from "react";
import L, { LatLngExpression, LatLng } from "leaflet";

function GameWindow() {
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<LatLngExpression | null>(null);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [treasure, setTreasure] = useState<Treasure | null>(null);
  const [error, setError] = useState<string>("");

  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const [round, setRound] = useState(1);
  interface Treasure {
    id?: string;
    location: {
      longitude: number;
      latitude: number;
    };
    imageURL: string;
    authorId: string;
  }

  const fetchRandomTreasure = async () => {
    try {
      const response = await fetch("/api/treasures/random");
      if (!response.ok) throw new Error("Failed to fetch treasure");
      const data: Treasure = await response.json();

      // Store both the image+meta for display + the correct coordinates
      setTreasure(data);
      setCorrectAnswer([data.location.latitude, data.location.longitude]);
      console.log("New treasure loaded:", data);
    } catch (err: any) {
      console.error("Error fetching treasure:", err);
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchRandomTreasure();
  }, []);

  const calculateScore = (distanceMeters: number): number => {
    const maxScore = 5000;
    const decayFactor = 150;
    return Math.max(0, Math.round(maxScore * Math.exp(-distanceMeters / decayFactor)));
  };

  const handleSubmit = async () => {
    if (!selectedMarker) {
      alert("Please choose a spot on the map before submitting.");
      return;
    }
    if (!correctAnswer || !treasure?.id) {
      alert("Still loading question—please wait a moment.");
      return;
    }

    const toLatLng = (input: LatLngExpression): LatLng =>
      Array.isArray(input)
        ? L.latLng(input[0], input[1])
        : L.latLng((input as any).lat, (input as any).lng);

    const userLatLng = toLatLng(selectedMarker);
    const correctLatLng = toLatLng(correctAnswer);

    const dist = userLatLng.distanceTo(correctLatLng);
    const sc = calculateScore(dist);
    setDistance(dist);
    setScore(sc);
    setShowResult(true);

    const payload = {
      treasureId: treasure.id,
      guessedLat: userLatLng.lat,
      guessedLng: userLatLng.lng,
      distance: dist,
      score: sc,
      userID: "",
    };

    try {
      const response = await fetch("/api/guesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("Guess recorded on server:", result);
    } catch (err) {
      console.error("Error submitting guess to server:", err);
    }

    fetchRandomTreasure();
    setShowResult(false);
  };

  const nextRound = () => setRound((prev) => (prev < 3 ? prev + 1 : 1));

  const handleZoomIn = () => setScale((p) => Math.min(p + 0.1, 3));
  const handleZoomOut = () => {
    setScale((p) => Math.max(p - 0.1, 1));
    setPosition({ x: 0, y: 0 });
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <>
      <div className="game-window-container">
        {}
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
            {}
            <img
              className="geo-image"
              src={treasure?.imageURL}
              draggable={false}
              onError={() => console.error("Image failed to load")}
              style={{
                transform: `translate(${position.x}px,${position.y}px) scale(${scale})`,
                transformOrigin: "top left",
                transition: isDragging ? "none" : "transform 0.3s ease",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
            {}
            <div className="box-button-square">
              <button className="box-button-button" onClick={handleZoomIn}>
                +
              </button>
              <button className="box-button-button" onClick={handleZoomOut}>
                –
              </button>
            </div>
          </div>
        </div>

        {}
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
            />
          </div>
        </div>
      </div>

      {}
      <div className="game-botton-container">
        <button
          className="game-submit-button"
          onClick={() => {
            handleSubmit();
            nextRound();
          }}
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
