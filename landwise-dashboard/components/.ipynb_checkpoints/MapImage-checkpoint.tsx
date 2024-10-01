'use client';

import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapImage = ({ latitude, longitude, zoom, bbox, imageUrl }) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  return (
    <div className="">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {imageUrl && bbox && (
          <ImageOverlay
            url={imageUrl} 
            bounds={[[bbox[1], bbox[0]], [bbox[3], bbox[2]]]}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapImage;
