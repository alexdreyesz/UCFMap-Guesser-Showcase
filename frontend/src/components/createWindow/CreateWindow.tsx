import "./CreateWindow.css";
import { useNavigate } from "react-router-dom";
import backB from "../../assets/icons/Back-Button.png";
import { LatLngExpression, LatLng } from "leaflet";
import SchoolMap from "../map/map";
import React, { useState } from "react";

// this is the main part of the create window, holds everything
function CreateWindow() {
  const [imgUrl, setUrl] = React.useState("../../assets/icons/no-image-icon.png");
  const [image, setImage] = useState<File | null>(null);
  const [localName, setName] = React.useState("");
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();

  interface MapMarkersProps {
    selectedMarker: LatLngExpression | null;
    onMarkerChange: (marker: LatLngExpression | null) => void;
  }

  function handleSetName(e: any): void {
    setName(e.target.value);
  }

  function goBack() {
    //if there are filled out points, such as images or text, display a warining
    if (
      window.confirm(
        "Your about to leave with out submitting. Data on this page won't be saved! Are you sure you want to leave?"
      )
    ) {
      navigate("/");
    } else return;
  }

  function runImage(e: any): void {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUrl("../../assets/icons/no-image-icon.png");
    }
  }

  async function runSubmit(event: any): Promise<void> {
    event.preventDefault();
    if (!selectedMarker || !localName || !image) {
      // if there is no marker, image  or location name
      alert("Please make sure that all fields are sastified");
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
        alert("Submition added");
        //returns home
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  return (
    <>
      <div className="location-container">
        <label className="text-location-Name">
          <strong>Location Name</strong>
          <input
            type="text"
            className="location-input"
            placeholder="example: UCF Student Center"
            onChange={handleSetName} // change when implemented.
          />
        </label>
      </div>

      <div className="create-window-container">
        <div>
          <div className="text-ucfmap-container">
            <p className="text-map-container"> Add Image</p>
          </div>
          <div
            className="window-box-upload-preview"
            style={{ backgroundImage: `url(${imgUrl})` }}
          ></div>
          <input type="file" accept="image/*" className="upload-img-input" onChange={runImage} />
        </div>

        <div>
          <div className="text-ucfmap-container">
            <p className="text-map-container"> Select Location</p>
          </div>
          <div className="window-box-map">
            <SchoolMap selectedMarker={selectedMarker} onMarkerChange={setSelectedMarker} />
          </div>
        </div>
      </div>

      <button className="submit-button" onClick={runSubmit}>
        Submit
      </button>

      <img
        className="back-button-image"
        src={backB}
        onClick={goBack}
        style={{ cursor: "pointer" }}
      />
    </>
  );
}

export default CreateWindow;
