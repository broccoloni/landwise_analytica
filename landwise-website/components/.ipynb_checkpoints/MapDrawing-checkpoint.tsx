'use client';

import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents, useMap, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from 'react';
import { MousePointer, Dot, Undo, Redo, RotateCcw } from 'lucide-react';
import { calculatePolygonArea } from '@/utils/calculateArea';
import { LatLngTuple } from 'leaflet';
import { sqMetersPerAcre, getSizeFromSqM } from '@/utils/reports';
import { toTitleCase } from '@/utils/string';

interface MapDrawingProps {
  latitude: string | number | null;
  longitude: string | number | null;
  zoom: number;
  points: number[][];
  setPoints: React.Dispatch<React.SetStateAction<number[][]>>;
  size: string | null;
  setSize: React.Dispatch<React.SetStateAction<string | null>>;
}

interface MapClickHandlerProps {
  onPointAdd: (point: number[]) => void;
  onPointHover: (point: number[]) => void;
  onPolygonClose: () => void;
  onZoomChange: (zoom: number) => void;
  onCenterChange: (lat: number, lng: number) => void;
}

const ChangeView = ({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], zoom);
    map.doubleClickZoom.disable();
  }, [lat, lng, zoom, map]);

  return null;
};


// Main MapDrawing component
export default function MapDrawing({
  latitude: initialLatitude,
  longitude: initialLongitude,
  zoom: initialZoom,
  points,
  setPoints,
  size,
  setSize,
}: MapDrawingProps) {
  const [hoverPoint, setHoverPoint] = useState<number[] | null>(null);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [latitude, setLatitude] = useState<string|number|null>(initialLatitude);
  const [longitude, setLongitude] = useState<string|number|null>(initialLongitude);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [redoStack, setRedoStack] = useState<number[][]>([]);
  const [isPlacingMode, setIsPlacingMode] = useState(true);
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);
  
  if (latitude === null || longitude === null) {
    throw new Error('Both Latitude and Longitude must be provided to MapDrawing');
  }
  const lat = parseFloat(String(latitude));
  const lng = parseFloat(String(longitude));


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

  const MapClickHandler: React.FC<MapClickHandlerProps> = ({
    onPointAdd,
    onPointHover,
    onPolygonClose,
    onZoomChange,
    onCenterChange
  }) => {
    const map = useMap();
      
    useMapEvents({
      click(e: any) {
        const { lat, lng } = e.latlng;
        if (isPlacingMode) {
          onPointAdd([lat, lng]);
        } else {
          handlePointMove([lat, lng]);
        }
      },
      dblclick() {
        map.doubleClickZoom.disable();
        onPolygonClose();
      },
      mousemove(e: any) {
        const { lat, lng } = e.latlng;
        if (!isPlacingMode && draggedPointIndex !== null) {
          handlePointMove([lat, lng]);
        } else if (isPlacingMode) {
          onPointHover([lat, lng]);
        }
      },
      zoomend(e: any) {
        onZoomChange(e.target.getZoom());
      },
      moveend(e: any) {
        const { lat, lng } = e.target.getCenter();
        onCenterChange(lat, lng);
      }
    });

    useEffect(() => {
      map.doubleClickZoom.disable();
      if (!isPlacingMode && draggedPointIndex !== null) {
        // Disable map dragging while dragging a point
        map.dragging.disable();
        map.doubleClickZoom.disable();
      } else {
        // Enable map dragging when not dragging a point
        map.dragging.enable();
        map.doubleClickZoom.enable();
      }
    }, [isPlacingMode, draggedPointIndex, map]);
      
    return null;
  };
    
  // Combine the points and the hovered point to show a preview
  const polygonPoints = hoverPoint && isPlacingMode
    ? [...(points as LatLngTuple[]), ([hoverPoint[0], hoverPoint[1]] as LatLngTuple)]
    : (points as LatLngTuple[]);


  const cursorStyle = isPlacingMode ? 'crosshair' : 'move';

  const area = calculatePolygonArea(polygonPoints);

  useEffect(() => {
    if (area !== null) {
      const newSize = getSizeFromSqM(area);
      if (newSize !== size) {
        setSize(newSize);
      }
    } else if (area === null && size) {
        setSize(null);
    } 
  }, [area, size]);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="">
          <div className="inline-flex justify-start rounded-md mr-4">
            <button
              className={`py-2 px-4 bg-medium-brown dark:bg-dark-green text-white ${!isPlacingMode && 'opacity-75'} border border-white rounded-l-md hover:opacity-75`}
              onClick={() => {
                setIsPlacingMode(false);
                if (!isPolygonClosed) {
                  handlePolygonClose();
                }
              }}
            >
              <MousePointer />
            </button>
            <button
              className={`py-2 px-4 bg-medium-brown dark:bg-dark-green text-white ${isPlacingMode && 'opacity-75'} border border-white rounded-r-md hover:opacity-75`}
              onClick={() => {
                setIsPlacingMode(true);
                setIsPolygonClosed(false); // Reopen the polygon when switching back to placing mode
              }}
            >
              <Dot />
            </button>
          </div>
        </div>
        <div className="">
          <div className="inline-flex rounded-md">
            <button
              className="bg-medium-brown dark:bg-dark-green text-white py-2 px-4 rounded-l-md border border-white hover:opacity-75"
              onClick={handleUndo}
              disabled={points.length === 0}
            >
              <Undo />
            </button> 
            <button
              className="bg-medium-brown dark:bg-dark-green text-white py-2 px-4 border border-white hover:opacity-75"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
            >
              <Redo />
            </button> 
            <button
              className="bg-medium-brown dark:bg-dark-green text-white py-2 px-4 rounded-r-md border border-white hover:opacity-75"
              onClick={handleReset}
            >
              <RotateCcw />
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <div className="w-[50%] flex justify-between text-center">
          <div className="w-44 bg-medium-brown dark:bg-dark-green text-white rounded-tl border-t border-l border-r border-gray-800 dark:border-white px-4 py-2">Area </div>
          <div className="w-full px-4 py-2 bg-white text-black rounded-tr border-t border-r border-gray-800 dark:border-white">
            {area ? (
              <div className="flex">
                <div className="mr-2">{`${area} m\u00B2`},</div>
                <div>{`${Math.round(area / sqMetersPerAcre)} ac.`}</div>
              </div>
            ) : (
              <div className="">Not enough points</div>
            )}
          </div>
        </div>
        <div className="w-[50%] flex justify-between text-center">
          <div className="w-44 bg-medium-brown dark:bg-dark-green text-white rounded-tl border-t border-l border-r border-gray-800 dark:border-white px-4 py-2">Property Size </div>
          <div className="w-full px-4 py-2 bg-white text-black rounded-tr border-t border-r border-gray-800 dark:border-white">
            {size ? (
              <div className="">{toTitleCase(size)}</div>
            ) : (
              <div className="">Not enough points</div>
            )}
          </div>
        </div>
      </div>
        
      <MapContainer
          style={{ height: "400px", width: "100%", cursor: cursorStyle }}
          doubleClickZoom={false}
      >
        <ScaleControl position="bottomleft" maxWidth={200} metric={true} imperial={true} />
        <ChangeView lat={lat} lng={lng} zoom={zoom} />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
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
                mouseup: () => setDraggedPointIndex(null)
              }}
            />
          ))}
        </>
        )}
      </MapContainer>
    </div>
  );
}
