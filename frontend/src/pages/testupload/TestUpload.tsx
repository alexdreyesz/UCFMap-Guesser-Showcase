import { useState } from "react";
import Header from "../../components/header/Header";

export default function TestUpload() {
  const [errorMessage, setErrorMessage] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const isValidNumber = (value: string) => {
    const number = parseFloat(value);
    return !isNaN(number) && isFinite(number);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (!isValidNumber(latitude) || !isValidNumber(longitude)) {
      setErrorMessage("Please enter valid latitude and longitude values.");
      return;
    }
    event.preventDefault();
    setErrorMessage("");
    const formData = new FormData();
    formData.append("location", JSON.stringify({ latitude, longitude }));
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await fetch("/api/treasures/create", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Error uploading image");
        return;
      }
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error uploading image: ", error);
      setErrorMessage("Error uploading image");
    }
  };

  return (
    // page code goes here
    <>
      <Header />
      <div className="login-container">
        <div className="login-box">
          <div className="login-title">UCFMAP Question Creator</div>
          <input
            type="number"
            value={latitude}
            onChange={(ev) => setLatitude(ev.target.value)}
            className="login-input"
            placeholder="Latitude"
          />
          <input
            type="number"
            value={longitude}
            onChange={(ev) => setLongitude(ev.target.value)}
            className="login-input"
            placeholder="Longitude"
          />
          {
            // I need an image upload here
          }
          <input
            type="file"
            className="login-input"
            onChange={(ev) => setImage(ev.target.files?.length ? ev.target.files[0] : null)}
          />

          <button onClick={handleSubmit} className="login-button">
            Login
          </button>
          <div className="error-message">{errorMessage}</div>
        </div>
      </div>
    </>
  );
}
