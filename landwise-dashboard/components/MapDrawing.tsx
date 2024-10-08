'use client';

import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from 'react';
import { MousePointer, Dot, Undo, Redo, RotateCcw } from 'lucide-react';

// Utility to calculate distance between two points (Haversine formula approximation for short distances)
// const calculateDistance = (point1: number[], point2: number[]) => {
//   const [lat1, lng1] = point1;
//   const [lat2, lng2] = point2;
//   const R = 6371000; // radius of Earth in meters
//   const phi1 = (lat1 * Math.PI) / 180;
//   const phi2 = (lat2 * Math.PI) / 180;
//   const dphi = ((lat2 - lat1) * Math.PI) / 180;
//   const dlambda = ((lng2 - lng1) * Math.PI) / 180;

//   const a =
//     Math.sin(dphi / 2) * Math.sin(dphi / 2) +
//     Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) * Math.sin(dlambda / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // distance in meters
// };

interface MapDrawingProps {
  latitude: string | null; // Latitude can be a string or null
  longitude: string | null; // Longitude can be a string or null
  zoom: number;
}

const ChangeView = ({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) => {
  const map = useMap();
  map.setView([lat, lng], zoom);
  return null;
};

// Main MapDrawing component
export default function MapDrawing({ latitude: initialLatitude, longitude: initialLongitude, zoom: initialZoom }: MapDrawingProps) {
  const [points, setPoints] = useState<number[][]>([]);  // Array of latitude/longitude points
  const [hoverPoint, setHoverPoint] = useState<number[] | null>(null);  // Hover point
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);  // Whether the polygon is finalized
  const [latitude, setLatitude] = useState<string>(initialLatitude);
  const [longitude, setLongitude] = useState<string>(initialLongitude);
  const [zoom, setZoom] = useState<number>(initialZoom);  // Store the zoom level in state
  const [redoStack, setRedoStack] = useState<number[][]>([]);
  const [isPlacingMode, setIsPlacingMode] = useState(true);
  
  if (latitude === null || longitude === null) {
    throw new Error('Both Latitude and Longitude must be provided to MapDrawing');
  }
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid Latitude or Longitude provided to MapDrawing');
  }

  // Handle center change
  const handleCenterChange = (newLat: number, newLng: number) => {
    setLatitude(newLat.toString());
    setLongitude(newLng.toString());
  };

  const handlePointAdd = (point: number[]) => {
    if (isPlacingMode && !isPolygonClosed) {
      if (points.length === 0 || (point[0] !== points[points.length - 1][0] || point[1] !== points[points.length - 1][1])) {
        setPoints([...points, point]);  // Add new point
      }
    }
  };

  // Handle moving an existing point
  const handlePointMove = (point: number[]) => {
    if (!isPlacingMode && hoverPoint) {
      const updatedPoints = points.map((p, index) =>
        index === points.length - 1 ? point : p // Move the last point (or implement a more complex logic if needed)
      );
      setPoints(updatedPoints);
    }
  };

  // Handle hover point change
  const handlePointHover = (point: number[]) => {
    if (!isPolygonClosed) {
      setHoverPoint(point);
    }
  };

  // Finalize the polygon
  const handlePolygonClose = () => {
    if (points.length >= 3) {
      setIsPolygonClosed(true);
      console.log("Final Polygon Points:", points);
    } else {
      alert("At least 3 points are required to create a polygon.");
    }
  };
  
  const handleUndo = () => {
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      setRedoStack([...redoStack, lastPoint]); // Push the last point to the redo stack
      setPoints(points.slice(0, -1));  // Remove the last point
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastRedoPoint = redoStack[redoStack.length - 1];
      setPoints([...points, lastRedoPoint]); // Add the last point from the redo stack
      setRedoStack(redoStack.slice(0, -1)); // Remove it from the redo stack
    }
  };
    
  // Handle reset and starting a new polygon
  const handleReset = () => {
    setPoints([]);
    setIsPolygonClosed(false);
    setHoverPoint(null);
  };

  const MapClickHandler = ({ onPointAdd, onPointHover, onPolygonClose, onZoomChange, onCenterChange }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (isPlacingMode) {
          onPointAdd([lat, lng]);  // Add point on click
        } else {
          handlePointMove([lat, lng]); // Move existing point
        }
      },
      dblclick() {
        onPolygonClose();  // Close polygon on double-click
      },
      mousemove(e) {
        const { lat, lng } = e.latlng;
        onPointHover([lat, lng]);  // Track mouse position
      },
      zoomend(e) {
        onZoomChange(e.target.getZoom());  // Update zoom level when zooming ends
      },
      moveend(e) {
        const { lat, lng } = e.target.getCenter(); // Get new center of the map
        onCenterChange(lat, lng);  // Update latitude and longitude
      }
    });
    return null;
  };
    
  // Combine the points and the hovered point to show a preview
  const polygonPoints = hoverPoint ? [...points, hoverPoint] : points;

  const cursorStyle = isPlacingMode ? 'crosshair' : 'move';

    
  return (
    <div className="w-full">
      <div className="">
        <div className="inline-flex justify-start rounded-md mr-4">
          <button
            className={`py-2 px-4 bg-accent text-white ${!isPlacingMode && 'opacity-75'} rounded-l-md hover:opacity-75`}
            onClick={() => setIsPlacingMode(false)}
          >
            <MousePointer /> {/* Icon for moving mode */}
          </button>
          <button
            className={`py-2 px-4 bg-accent text-white ${isPlacingMode && 'opacity-75'} rounded-r-md hover:opacity-75`}
            onClick={() => setIsPlacingMode(true)}
          >
            <Dot /> {/* Icon for placing mode */}
          </button>
        </div>
        <div className="inline-flex rounded-md">
          <button
            className="bg-accent text-white py-2 px-4 rounded-l-md border border-white hover:opacity-75"
            onClick={handleUndo}
            disabled={points.length === 0}
          >
            <Undo />
          </button> 
          <button
            className="bg-accent text-white py-2 px-4 border border-white hover:opacity-75"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
          >
            <Redo />
          </button> 
          <button
            className="bg-accent text-white py-2 px-4 rounded-r-md border border-white hover:opacity-75"
            onClick={handleReset}
          >
            <RotateCcw />
          </button>
        </div>
      </div>
        
      <MapContainer
          style={{ height: "400px", width: "100%", cursor: cursorStyle }}
          doubleClickZoom={false}  // Disable default double-click zoom
      >
        <ChangeView lat={lat} lng={lng} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler
          onPointAdd={handlePointAdd}
          onPointHover={handlePointHover}
          onPolygonClose={handlePolygonClose}
          onZoomChange={setZoom}
          onCenterChange={handleCenterChange}  // Pass center change handler
        />
        {polygonPoints.length > 0 && (
          <>
            <Polygon
              positions={polygonPoints}
              pathOptions={{ color: 'black', fillColor: 'grey', fillOpacity: 0.5 }}
            />
            {polygonPoints.map((point, index) => (
              <CircleMarker
                key={index}
                center={point}
                radius={2}
                pathOptions={{ color: 'black' }}
              />
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
