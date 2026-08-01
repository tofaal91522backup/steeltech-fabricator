import React, { useRef, useState } from "react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStreaming(true);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "captured.png", { type: "image/png" });
      onCapture(file); // pass the image file back
    });
  };

  return (
    <div className="text-center">
      {!streaming ? (
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open Camera
        </button>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            // className="w-[300px] max-w-md"
          />
          <button
            onClick={captureImage}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Capture
          </button>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
