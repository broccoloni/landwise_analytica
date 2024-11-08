'use client';

import { MapContainer, TileLayer, ImageOverlay, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from 'react';

interface MapImageProps {
  latitude: string | null; // Latitude can be a string or null
  longitude: string | null; // Longitude can be a string or null
  zoom: number; 
  bbox?: number[]; // Assuming bbox is an array of numbers
  imageUrl?: string; // Optional prop
}

// This component sets the map's view and zoom level
const ChangeView = ({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) => {
  const map = useMap();
  map.setView([lat, lng], zoom);
  return null; // This component doesn't render anything
};

const MapImage: React.FC<MapImageProps> = ({ latitude, longitude, zoom, bbox=[], imageUrl='' }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

    
  // Validate latitude and longitude
  if (latitude === null || longitude === null) {
    throw new Error('Both Latitude and Longitude must be provided to MapImage');
  }

  // Parse latitude and longitude
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Further validate parsed values
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid Latitude or Longitude provided');
  }

  return (
    <div className="">
      <MapContainer
        style={{ height: "400px", width: "100%" }}
      >
        <ChangeView lat={lat} lng={lng} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {imageUrl && bbox && bbox.length === 4 && (
          <ImageOverlay
            url={imageUrl}
            bounds={[[bbox[1], bbox[0]], [bbox[3], bbox[2]]]}
          />
        )}
      </MapContainer>
      <style jsx global>{`
        .leaflet-control {
          z-index: 0 !important;
        }
        .leaflet-pane {
          z-index: 0 !important;
        }
        .leaflet-top, .leaflet-bottom {
          z-index: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default MapImage;
