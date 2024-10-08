'use client';

import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from 'react';
import { MousePointer, Dot, Undo, Redo, RotateCcw } from 'lucide-react';

interface MapDrawingProps {
  latitude: string | null;
  longitude: string | null;
  zoom: number;
}

const ChangeView = ({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) => {
  const map = useMap();
  map.setView([lat, lng], zoom);
  return null;
};

// Main MapDrawing component
export default function MapDrawing({ latitude: initialLatitude, longitude: initialLongitude, zoom: initialZoom }: MapDrawingProps) {
  const [points, setPoints] = useState<number[][]>([]);
  const [hoverPoint, setHoverPoint] = useState<number[] | null>(null);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);  // Whether the polygon is finalized
  const [latitude, setLatitude] = useState<string>(initialLatitude);
  const [longitude, setLongitude] = useState<string>(initialLongitude);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [redoStack, setRedoStack] = useState<number[][]>([]);
  const [isPlacingMode, setIsPlacingMode] = useState(true);
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);
  
  if (latitude === null || longitude === null) {
    throw new Error('Both Latitude and Longitude must be provided to MapDrawing');
  }
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid Latitude or Longitude provided to MapDrawing');
  }

  const handleCenterChange = (newLat: number, newLng: number) => {
    setLatitude(newLat.toString());
    setLongitude(newLng.toString());
  };

  const handlePointAdd = (point: number[]) => {
    if (isPlacingMode && !isPolygonClosed) {
      if (points.length === 0 || (point[0] !== points[points.length - 1][0] || point[1] !== points[points.length - 1][1])) {
        setPoints([...points, point]);
      }
      if (redoStack.length !== 0) {
        setRedoStack([]);
      }
    }
  };

  // Handle moving an existing point
  const handlePointMove = (point: number[]) => {
    if (!isPlacingMode && draggedPointIndex !== null) {
      const updatedPoints = [...points];
      updatedPoints[draggedPointIndex] = point;
      setPoints(updatedPoints);
    }
  };


  // Handle hover point change
  const handlePointHover = (point: number[]) => {
    if (isPlacingMode && !isPolygonClosed) {
      setHoverPoint(point);
    }
  };

  // Finalize the polygon
  const handlePolygonClose = () => {
    if (points.length >= 3) {
      setIsPolygonClosed(true);
      setIsPlacingMode(false);
      console.log("Final Polygon Points:", points);
    } else {
      alert("At least 3 points are required to create a polygon.");
    }
  };
  
  const handleUndo = () => {
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
        
      setRedoStack([...redoStack, lastPoint]);
      setPoints(points.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastRedoPoint = redoStack[redoStack.length - 1];
      setPoints([...points, lastRedoPoint]);
      setRedoStack(redoStack.slice(0, -1));
    }
  };
    
  const handleReset = () => {
    setPoints([]);
    setIsPolygonClosed(false);
    setIsPlacingMode(true);
    setHoverPoint(null);
  };

  const MapClickHandler = ({ onPointAdd, onPointHover, onPolygonClose, onZoomChange, onCenterChange }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (isPlacingMode) {
          onPointAdd([lat, lng]);
        } else {
          handlePointMove([lat, lng]);
        }
      },
      dblclick() {
        onPolygonClose();
      },
      mousemove(e) {
        const { lat, lng } = e.latlng;
        if (!isPlacingMode && draggedPointIndex !== null) {
          handlePointMove([lat, lng]);
        } else if (isPlacingMode) {
          onPointHover([lat, lng]);
        }
      },
      zoomend(e) {
        onZoomChange(e.target.getZoom());
      },
      moveend(e) {
        const { lat, lng } = e.target.getCenter();
        onCenterChange(lat, lng);
      }
    });
    return null;
  };
    
  // Combine the points and the hovered point to show a preview
  const polygonPoints = hoverPoint && isPlacingMode ? [...points, hoverPoint] : points;

  const cursorStyle = isPlacingMode ? 'crosshair' : 'move';

  const Drawing = ({ polygonPoints }: { polygonPoints: number[][] }) => {
    return (
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
            eventHandlers={{
              mousedown: () => {
                setDraggedPointIndex(index);
              },
              mouseup: () => {
                setDraggedPointIndex(null);
              }
            }}
          />
        ))}
      </>
    );
  };

    
  return (
    <div className="w-full">
      <div className="">
        <div className="inline-flex justify-start rounded-md mr-4">
          <button
            className={`py-2 px-4 bg-accent text-white ${!isPlacingMode && 'opacity-75'} rounded-l-md hover:opacity-75`}
            onClick={() => {
              setIsPlacingMode(false);
              if (!isPolygonClosed) {
                handlePolygonClose(); // Close the polygon if it's not already closed
              }
            }}
          >
            <MousePointer />
          </button>
          <button
            className={`py-2 px-4 bg-accent text-white ${isPlacingMode && 'opacity-75'} rounded-r-md hover:opacity-75`}
            onClick={() => {
              setIsPlacingMode(true);
              setIsPolygonClosed(false); // Reopen the polygon when switching back to placing mode
            }}
          >
            <Dot />
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
          doubleClickZoom={false}
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
          onCenterChange={handleCenterChange}
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
                eventHandlers={{
                  mousedown: () => setDraggedPointIndex(index),
                  mouseup: () => setDraggedPointIndex(null)  // Stop dragging on mouse up
                }}
              />
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
