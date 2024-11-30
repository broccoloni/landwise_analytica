'use client';

import { MapContainer, TileLayer, ImageOverlay, useMap, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from 'react';

interface MapImageProps {
  latitude: number | null;
  longitude: number | null;
  zoom: number; 
  bbox?: number[][];
  imageUrl?: string;
}

// This component sets the map's view and zoom level
const ChangeView = ({ lat, lng, zoom, bbox }: { lat: number; lng: number; zoom: number; bbox: number[][] }) => {
  const map = useMap();
  map.setView([lat, lng]);
  map.fitBounds(bbox);  // maybe remove this - not sure
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
  const lat = latitude;
  const lng = longitude;

  // Further validate parsed values
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid Latitude or Longitude provided');
  }

  return (
    <div className="">
      <MapContainer
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ScaleControl position="bottomleft" maxWidth={200} metric={true} imperial={true} />
        {imageUrl && bbox && (
          <>
            <ChangeView lat={lat} lng={lng} zoom={zoom} bbox={bbox} />
            <ImageOverlay
              url={imageUrl}
              bounds={bbox}
            />
          </>
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
