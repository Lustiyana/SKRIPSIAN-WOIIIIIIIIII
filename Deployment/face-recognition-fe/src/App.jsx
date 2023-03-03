import { useEffect, useRef, useState } from "react";
import "./App.css";
import { saveAs } from "file-saver";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [photoUrl, setPhotoUrl] = useState(null);

  const handleSuccess = (stream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const handleError = (error) => {
    console.log("Error accessing media devices", error);
  };

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      handleSuccess(stream);
    } catch (error) {
      handleError(error);
    }
  };

  const takePhoto = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setPhotoUrl(dataUrl);
      saveImageLocally();
    }
  };

  const saveImageLocally = () => {
    fetch(photoUrl)
      .then((res) => res.blob())
      .then((blob) => {
        saveAs(blob, "image.jpg");
      });
  };

  return (
    <div className="App">
      <button onClick={getVideo}>Start Video</button>
      <button onClick={takePhoto}>Take Photo</button>
      {photoUrl && (
        <div>
          <img src={photoUrl} alt="object" />
        </div>
      )}
      <video ref={videoRef} autoPlay></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default App;
