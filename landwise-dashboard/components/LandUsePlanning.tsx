'use client';

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import chroma from "chroma-js";
import { LinearColormap } from "branca"; // Assuming you have this utility

const LandUsePlanning = ({ latitude, longitude }) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const zoom = 15;
    
  const crops = ["Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy"];
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [imageData, setImageData] = useState(null);
  const [bounds, setBounds] = useState([[0, 0], [1, 1]]); // Update to your actual bounds
  const [vmin, setVmin] = useState(0);
  const [vmax, setVmax] = useState(100);
  const [imageBounds, setImageBounds] = useState(null); // Set based on your actual image bounds

  // Define crop yield thresholds
  const cropThresholds = {
    Flaxseed: { vmin: 56, vmax: 96 },
    Wheat: { vmin: 77, vmax: 117 },
    Barley: { vmin: 61, vmax: 101 },
    Oats: { vmin: 56, vmax: 96 },
    Canola: { vmin: 43, vmax: 83 },
    Peas: { vmin: 66, vmax: 106 },
    Corn: { vmin: 63, vmax: 103 },
    Soy: { vmin: 63, vmax: 103 },
  };

  // Fetch and process raster data
  const fetchRasterData = async (crop) => {
    const rasterFile = `/demo/ag_tips/${crop}.png`;
    
    const response = await fetch(rasterFile);
    const blob = await response.blob();
    
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      // Extract pixel data
      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      const rasterData = new Uint8Array(imageData.length / 4); // One value per pixel

      for (let i = 0; i < imageData.length; i += 4) {
        rasterData[i / 4] = imageData[i]; // Assuming grayscale image
      }

      // Normalize data
      const normData = normalizeData(rasterData);
      setImageData(normData);
      
      // Set image bounds according to your data (top-left and bottom-right corners)
      setImageBounds([[0, 0], [img.height, img.width]]);
      
      // Set vmin and vmax for color mapping
      const { vmin, vmax } = cropThresholds[crop];
      setVmin(vmin);
      setVmax(vmax);
    };
  };

  // Normalization function
  const normalizeData = (data) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return data.map(value => (value - min) / (max - min)); // Normalize to [0, 1]
  };

  // Effect to fetch data when crop changes
  useEffect(() => {
    fetchRasterData(selectedCrop);
  }, [selectedCrop]);

  return (
    <div className="land-use-planning-container">
      <h1>Agriculture Tips</h1>
      <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
        {crops.map((crop) => (
          <option key={crop} value={crop}>
            {crop}
          </option>
        ))}
      </select>

      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {imageData && imageBounds && (
          <ImageOverlay
            url={`data:image/png;base64,${imageData}`}
            bounds={[[lat-0.01, lng+0.01], [lat-0.01, lng+0.01]]}
            opacity={0.7}
          />
        )}
      </MapContainer>

      {/* Optionally, add a legend or color mapping */}
      {/* Add the LinearColormap as needed here */}
    </div>
  );
};

export default LandUsePlanning;
