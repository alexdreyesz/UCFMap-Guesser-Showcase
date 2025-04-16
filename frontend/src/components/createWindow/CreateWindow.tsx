import "./CreateWindow.css";
import { useNavigate } from "react-router-dom";
import { LatLngExpression, LatLng } from "leaflet";
import SchoolMap from "../map/map";
import React, { useRef, useState } from "react";
import noImageIcon from "../../assets/icons/no-image-icon.png";
import clip from "../../assets/icons/clip.png";

// this is the main part of the create window, holds everything
function CreateWindow() {
  const [imgUrl, setUrl] = React.useState(noImageIcon);
  const [image, setImage] = useState<File | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();

  interface MapMarkersProps {
    selectedMarker: LatLngExpression | null;
    onMarkerChange: (marker: LatLngExpression | null) => void;
  }

  const [hasImageError, setHasImageError] = useState(false);

  function runImage(e: any): void {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setHasImageError(false); // Reset error state
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setHasImageError(true); // Trigger error state if it's not an image
      setUrl("../../assets/icons/no-image-icon.png");
    }
  }

  // Submit Info
  async function runSubmit(event: any): Promise<void> {
    event.preventDefault();
    setMessage("");
    if (!selectedMarker || !image) {
      // if there is no marker, image  or location name
      setMessage("Please make sure you have a image and a location set.");
      return;
    }
    const localPack = {
      latitude: (selectedMarker as LatLng).lat,
      longitude: (selectedMarker as LatLng).lng,
    };
    const jsPack = {
      location: JSON.stringify(localPack),
      image: image,
    };
    try {
      //set response
      const response = await fetch("/api/treasures/create", {
        // Need to replace with api code
        method: "POST",
        body: JSON.stringify(jsPack),
        headers: { "Content-Type": "application/json" },
      });
      const reply = JSON.parse(await response.text()); // this should have the text
      if (reply.status == 401) {
        // we may not have a user id, so maybe this needs to be a status check
        const errorData = await response.json();
        alert(errorData.error || "Error uploading image");
      } //
      else {
        //create user cache/cookie
        //stores username as UserName and UserEmail
        setMessage("Submition complete");
        //returns home
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

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

  const [xCoordinate, xCoordinateSet] = useState(1);
  const [yCoordinate, yCoordinateSet] = useState(1);

  return (
    <>
      <div className="text-rounds-container">
        <p>
          <strong>Upload an Image. Then click the location on the map to set the marker</strong>
        </p>
      </div>

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
