'use client';

import { merriweather, roboto } from '@/ui/fonts';
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Slider } from "@mui/material";
import { fromArrayBuffer } from "geotiff";
import chroma from 'chroma-js';
import { valuesToNames } from '@/types/valuesToNames';

const LandHistory = ({ latitude, longitude }) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const zoom = 15;

  const rasterDataCache = useRef();
  const [year, setYear] = useState(2014);
  const [rasterData, setRasterData] = useState(null);
  const [imageBounds, setImageBounds] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});

  const colors = chroma.scale('Set1').colors(Object.keys(valuesToNames).length);
    
  const fetchRasterData = async (url) => {
    const response = await fetch(url);    
    const arrayBuffer = await response.arrayBuffer();    
    const tiff = await fromArrayBuffer(arrayBuffer);    
    const image = await tiff.getImage();    
    const rasterData = await image.readRasters();
    const width = image.getWidth();
    const height = image.getHeight();
    const bbox = image.getBoundingBox()

    return {rasterData, width, height, bbox};
  };
    
  const rasterToImageURL = (rasterData, width, height, scaleFactor = 5) => {
    // Create a hidden canvas element
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Disable image smoothing to preserve sharpness
    ctx.imageSmoothingEnabled = false;

    const imageData = ctx.createImageData(width, height);

    // Fill the imageData with the original raster data
    for (let i = 0; i < rasterData[0].length; i++) {
      const value = rasterData[0][i];
      const index = Object.keys(valuesToNames).findIndex((key) => parseInt(key) === value);
      const color = index !== -1 ? chroma(colors[index]) : chroma('black');
      const [r, g, b] = color.rgb();

      let a = 255;
      if (value == 0 || value == 10) {
        a = 0;
      }

      imageData.data[i * 4] = r;
      imageData.data[i * 4 + 1] = g;
      imageData.data[i * 4 + 2] = b;
      imageData.data[i * 4 + 3] = a;
    }

    // Put the imageData on the canvas at original resolution
    ctx.putImageData(imageData, 0, 0);

    // Create a new canvas to hold the upscaled version
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = width * scaleFactor;
    scaledCanvas.height = height * scaleFactor;
    const scaledCtx = scaledCanvas.getContext("2d");

    // Disable image smoothing on the scaled canvas
    scaledCtx.imageSmoothingEnabled = false;

    // Draw the original canvas onto the scaled canvas, applying the scale
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    // Return the scaled image as a data URL
    return scaledCanvas.toDataURL();
  };
    

  // Fetch raster data for all years on mount
  useEffect(() => {
    const fetchAllRasterData = async () => {
      const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
      const rasterDataForYears = {};

      for (const yr of years) {
        const rasterFile = `/demo/land_history/prior_inventory/${yr}.tif`;
        const data = await fetchRasterData(rasterFile);
        rasterDataForYears[yr] = data;
      }

      // Store all fetched data in cache
      rasterDataCache.current = rasterDataForYears;

      // Set initial year data
      const rd = rasterDataForYears[year].rasterData;
      const w = rasterDataForYears[year].width;
      const h = rasterDataForYears[year].height;
      const b = rasterDataForYears[year].bbox;
      setRasterData(rasterToImageURL(rd, w, h));
      setImageBounds(b);
      updateLegend(rd);
    };

    fetchAllRasterData();
  }, []);

  // Update map and legend when the year is changed
  useEffect(() => {
    if (rasterDataCache.current && rasterDataCache.current[year]) {
      const { rasterData, width, height, bbox } = rasterDataCache.current[year];
      const imageUrl = rasterToImageURL(rasterData, width, height);

      console.log(imageUrl);
        
      setRasterData(imageUrl);
      setImageBounds(bbox);
      updateLegend(rasterData);
    }
  }, [year]);
  
  const updateLegend = (data) => {        
    const flatData = data[0];
    const uniqueElements = new Set(flatData);
    const newSelectedColors = {};
  
    uniqueElements.forEach((value) => {
      const name = valuesToNames[value];
      if (name && name != 'Cloud') {
        const index = Object.keys(valuesToNames).findIndex((key) => parseInt(key) === value);
        newSelectedColors[name] = colors[index];
      }
    });
      
    setSelectedColors(newSelectedColors);
  };

  const handleYearChange = (event, newValue) => {
    setYear(newValue);
  };

  return (
    <div className={`${roboto.className} land-history-container`}>
      <div className = "flex justify-center items-left">
        <div className = "mr-4">Select The Year</div>
        <div className="controls w-32">
          <Slider
            value={year}
            onChange={handleYearChange}
            min={2014}
            max={2021}
            step={1}
            valueLabelDisplay="auto"
            marks
          />
        </div>    
      </div>


      <div className="map-and-legend">
        {/* Leaflet Map */}
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {rasterData && (
            <ImageOverlay
              url={rasterData} 
              bounds={[[imageBounds[1], imageBounds[0]], [imageBounds[3], imageBounds[2]]]}
              opacity={0.7}
            />
          )}
        </MapContainer>

        {/* Legend */}
        <div className="legend">
          <div className={`${merriweather.className} text-center mb-2 font-medium`}>Legend</div>
          {Object.keys(selectedColors).map((key) => (
            <div key={key} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: selectedColors[key] }}
              ></span>
              <span className="legend-label">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .land-history-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .controls {
          margin-bottom: 20px;
        }
        .map-and-legend {
          display: flex;
          width: 100%;
        }
        .legend {
          margin-left: 20px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        .legend-color {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      `}
      </style>
    </div>
  );
};

export default LandHistory;
