import "./CreateWindow.css";
import Map from "../map/map";
import backB from "../../assets/icons/Back-Button.png";
import React, { useState } from "react";
// this is the main part of the create window, holds everything
function CreateWindow() {
  const [image, setImage] = React.useState("");
  const [imgUrl, setUrl] = React.useState("");
  const [img, setImg] = React.useState("");
  function handleSetLocation() {
    //text
  }
  function goBack() {}

  function handleImageChange(e: any): void {
    let file = e.target.value;

    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function runSubmit() {}
  return (
    <>
      <div className="create-window-container">
        <div>
          <div className="text-location-Name">
            <strong>Location Name</strong>
            <input
              type="text"
              className="location-input"
              placeholder="example: UCF Student Center"
              onChange={handleSetLocation} // change when implemented.
            />
          </div>
          <div className="window-box-upload-preview" style={{ background: "url(imgUrl)" }}>
            <p className="uploaded-img-text">{imgUrl}</p>
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div>
          <div className="text-ucfmap-container">
            <p className="text-map-container"> Select location</p>
          </div>
          <div className="window-box-map">
            <Map />
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
