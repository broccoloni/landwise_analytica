import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // For client-side libraries
import { fromUrl } from 'geotiff';
import 'leaflet/dist/leaflet.css'; // Make sure Leaflet's styles are included

// Dynamically load Leaflet components
const LeafletMap = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

const LandHistory = ({ latitude, longitude }) => {
  const [year, setYear] = useState(2014); // Initial year
  const [landData, setLandData] = useState(null); // For raster data

  // Function to get the GeoTIFF file URL based on the selected year
  const rasterFiles = (year) => {
    return `/demo/land_history/prior_inventory/${year}.tif`;
  };

  useEffect(() => {
    const loadGeoTIFF = async () => {
      const rasterFile = rasterFiles(year);
      try {
        const geotiff = await fromUrl(rasterFile);
        const image = await geotiff.getImage();
        const data = await image.readRasters();
        setLandData(data);
        // Handle land data processing similar to your Streamlit code here...
        // You can include your color mapping logic, transparency, etc.
      } catch (error) {
        console.error('Error loading GeoTIFF:', error);
      }
    };

    loadGeoTIFF();
  }, [year]); // Reload data when year changes

  // Function to generate color mappings
  const generateColorMappings = () => {
    // Example mapping; you can modify this to fit your needs
    const baseColors = ['#000000', '#3333ff', '#ff0000', '#00ff00', '#ffff00', '#00ffff', '#ff00ff'];
    const names = ['Cloud', 'Water', 'Forest', 'Agriculture', 'Urban', 'Wetlands', 'Desert'];

    const valueToColor = {};
    const nameToColor = {};

    names.forEach((name, index) => {
      valueToColor[index * 10] = baseColors[index % baseColors.length]; // Assign colors based on index
      nameToColor[name] = baseColors[index % baseColors.length]; // Assign the same color to name
    });

    return { valueToColor, nameToColor };
  };

  const { valueToColor, nameToColor } = generateColorMappings(); // Generate mappings

  const renderLegend = () => (
    <div style={{ padding: '10px' }}>
      <h4>Legend</h4>
      {Object.entries(nameToColor).map(([name, color]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: color }} />
          <span style={{ marginLeft: '10px' }}>{name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 3, paddingRight: '10px' }}>
        <h1>Land History</h1>
        <label htmlFor="year-slider">Select Year for Land History</label>
        <input
          type="range"
          id="year-slider"
          min="2014"
          max="2021"
          step="1"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <LeafletMap center={[latitude, longitude]} zoom={13}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='© OpenStreetMap contributors'
          />
          {/* Add any additional layers to the map here, like your color-mapped raster data */}
        </LeafletMap>
      </div>
      <div style={{ flex: 1 }}>
        {renderLegend()}
      </div>
    </div>
  );
};

export default LandHistory;
