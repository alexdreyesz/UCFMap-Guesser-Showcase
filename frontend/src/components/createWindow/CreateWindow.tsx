import "./CreateWindow.css";
import { useNavigate } from "react-router-dom";
import { LatLngExpression, LatLng } from "leaflet";
import SchoolMap from "../map/map";
import React, { useRef, useState } from "react";
import noImageIcon from "../../assets/icons/no-image-icon.png";
import clip from "../../assets/icons/clip.png";

function CreateWindow() {
  const [imgUrl, setUrl] = React.useState(noImageIcon);
  const [image, setImage] = useState<File | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);
  const [localName, setLocalName] = useState("");
  const [message, setMessage] = React.useState("");
  const [hasImageError, setHasImageError] = useState(false);
  const navigate = useNavigate();

  function runImage(e: any): void {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setHasImageError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setHasImageError(true);
      setUrl(noImageIcon);
    }
  }

  async function runSubmit(event: any): Promise<void> {
    event.preventDefault();

    if (!selectedMarker || !image) {
      alert("Please upload an image and select a location.");
      return;
    }

    const [lat, lng] = Array.isArray(selectedMarker)
      ? selectedMarker
      : [(selectedMarker as any).lat, (selectedMarker as any).lng];

    const formData = new FormData();
    formData.append("location", JSON.stringify({ latitude: lat, longitude: lng }));
    formData.append("image", image);

    try {
      const response = await fetch("/api/treasures/create", {
        method: "POST",
        body: formData,
      });

      const reply = await response.json();

      if (!response.ok) {
        alert(reply.error || "Error uploading treasure.");
        return;
      }

      alert("Treasure created successfully!");
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(error.toString());
    }
  }

  // Zoom & Drag logic for image
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 1));
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <>
      <div className="game-window-container">
        <div>
          <div className="image-rounds-container">
            <p>UCF Location: Upload An Image</p>
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
              onError={() => setHasImageError(true)}
              className="geo-image"
              src={imgUrl}
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

            <div className="upload-file-square">
              <label htmlFor="file-upload" className="upload-img-input-label">
                <img src={clip} className="upload-clip" />
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                className="upload-img-input"
                onChange={runImage}
              />
            </div>

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
            <p className="text-map-container">UCF MAP: Select Coordinate</p>
          </div>

          <div className="game-window-box-map">
            <SchoolMap
              selectedMarker={selectedMarker}
              onMarkerChange={setSelectedMarker}
              correctAnswer={null}
              showResult={false}
            />
          </div>
        </div>
      </div>

      <button className="submit-button" onClick={runSubmit}>
        SUBMIT
      </button>
      <p className="error-message">{message}</p>
    </>
  );
}

export default CreateWindow;
