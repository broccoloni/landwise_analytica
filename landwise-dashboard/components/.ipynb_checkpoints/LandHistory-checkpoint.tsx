import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { Slider } from "@mui/material";
import { fromArrayBuffer } from "geotiff";
import chroma from 'chroma-js';
import { valuesToNames } from '@/types/valuesToNames';

const DynamicMapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const colors = chroma.scale('Set3').colors(Object.keys(valuesToNames).length);

const fetchRasterData = async (url) => {
  const response = await fetch(url);

  console.log("RESPONSE:", response);
    
  const arrayBuffer = await response.arrayBuffer();

  console.log("arrayBuffer:", arrayBuffer);
    
  const tiff = await fromArrayBuffer(arrayBuffer);

  console.log("tiff:", tiff);
    
  const image = await tiff.getImage();
  const rasterData = await image.readRasters();

  return rasterData[0]; // For simplicity, we assume single-band data
};

const LandHistory = ({ latitude, longitude }) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const zoom = 14;

  const rasterDataCache = useRef();
  const [year, setYear] = useState(2014);
  const [rasterData, setRasterData] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});

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
      setRasterData(rasterDataForYears[year]);
      updateLegend(rasterDataForYears[year]);
    };

    fetchAllRasterData();
  }, []);

  // Update map and legend when the year is changed
  useEffect(() => {
    if (rasterDataCache.current && rasterDataCache.current[year]) {
      setRasterData(rasterDataCache.current[year]);
      updateLegend(rasterDataCache.current[year]);
    }
  }, [year]);

  const updateLegend = (data) => {
    const uniqueElements = new Set(data);
    const newSelectedColors = {};
    
    uniqueElements.forEach((value) => {
      const name = valuesToNames[value];
      if (name) {
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
    <div className="land-history-container">
      <div className="controls">
        <h1>Land History</h1>
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

      <div className="map-and-legend">
        {/* Leaflet Map */}
        <DynamicMapContainer
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
              url={rasterData} // Replace with the URL or base64 of the overlay image
              bounds={[[lat - 0.01, lng - 0.01], [lat + 0.01, lng + 0.01]]} // Example bounds
              opacity={0.7}
            />
          )}
        </DynamicMapContainer>

        {/* Legend */}
        <div className="legend">
          <h3>Legend</h3>
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
      `}</style>
    </div>
  );
};

export default LandHistory;
