'use client';

import Container from '@/components/Container';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useRouter } from 'next/navigation';
import Trends from '@/components/Trends';
import chroma from 'chroma-js';
import { valuesToNames } from '@/types/valuesToNames';
import { fromArrayBuffer } from "geotiff";
import { useState, useEffect, useRef, Suspense } from 'react';
import { Slider } from "@mui/material";
import Dropdown from '@/components/Dropdown';
import { MoveRight, ArrowRight, Loader2 } from 'lucide-react';
import NextImage from 'next/image';
import dynamic from 'next/dynamic';

import AddressDisplay from '@/components/AddressDisplay';

import SummaryScore from '@/components/SummaryScore';
import EstimatedYield from '@/components/EstimatedYield';
import Climate from '@/components/Climate';
import InfrastructureAccessibility from '@/components/InfrastructureAccessibility';
import Topography from '@/components/Topography';
import EconomicViability from '@/components/EconomicViability';

import { fetchRasterDataCache } from '@/hooks/fetchRasterDataCache';
import { fetchCropHeatMaps } from '@/hooks/fetchCropHeatMaps';

// const basePath = '/landwise_analytica';
const basePath = '';

const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Float32Array | Float64Array;
type LandUsePlanningCrop = "Flaxseed" | "Wheat" | "Barley" | "Oats" | "Canola" | "Peas" | "Corn" | "Soy";

interface ColorBarProps {
  vmin: number;
  vmax: number;
  numIntervals?: number;
}

const DEMO_ADDRESS = {
  address: "8159 Side Road 30, Wellington County, Ontario, N0B 2K0, Canada",
  lat: "43.6929954",
  lng: "-80.3071343",
  components: {
    "street_number": "8159",
    "route": "Side Road 30",
    "locality": "Rockwood",
    "administrative_area_level_3": "Centre Wellington",
    "administrative_area_level_2": "Wellington County",
    "administrative_area_level_1": "ON",
    "country": "CA",
    "postal_code": "N0B 2K0"
  },
};

export default function Home() {
  const router = useRouter();
  const scaleFactor=10;
  const isDemoAddress = true;
  const address = DEMO_ADDRESS.address;
  const lat = DEMO_ADDRESS.lat;
  const lng = DEMO_ADDRESS.lng;
  const addressComponents = DEMO_ADDRESS.components;

  const [landHistoryYear, setLandHistoryYear] = useState<number>(2014);
  const [rasterDataCache, setRasterDataCache] = useState<Record<number, any>>({});
  const colors = chroma.scale('Set1').colors(Object.keys(valuesToNames).length);
  const rasterData = rasterDataCache[landHistoryYear];

  const [activeTab, setActiveTab] = useState('EstimatedYield');
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'EstimatedYield':
        return <EstimatedYield />;
      case 'Climate':
        return <Climate />;
      case 'InfrastructureAccessibility':
        return <InfrastructureAccessibility />;
      case 'Topography':
        return <Topography />;
      case 'EconomicViability':
        return <EconomicViability />;
      default:
        return null;
    }
  };

  const tabs = [
    'EstimatedYield',
    'Climate',
    'InfrastructureAccessibility',
    'Topography',
    'EconomicViability',
  ];
    
  const rasterDataCache = fetchRasterDataCache(basePath);
  const cropHeatMaps = fetchCropHeatMaps(basePath);


  const handleLandHistoryYearChange = (event: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setLandHistoryYear(value[0]);
    } else {
      setLandHistoryYear(value);
    }
  };

  // LAND USE PLANNING
  const landUsePlanningCrops: LandUsePlanningCrop[] = ["Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy"];
  const landUsePlanningThresholds: Record<LandUsePlanningCrop, { vmin: number; vmax: number }> = {
    Flaxseed: { vmin: 56, vmax: 96 },
    Wheat: { vmin: 77, vmax: 117 },
    Barley: { vmin: 61, vmax: 101 },
    Oats: { vmin: 56, vmax: 96 },
    Canola: { vmin: 43, vmax: 83 },
    Peas: { vmin: 66, vmax: 106 },
    Corn: { vmin: 63, vmax: 103 },
    Soy: { vmin: 63, vmax: 103 },
  };
  const [selectedLandUsePlanningCrop, setSelectedLandUsePlanningCrop] = useState<LandUsePlanningCrop>(landUsePlanningCrops[0]);
  const [landUsePlanningImages, setLandUsePlanningImages] = useState<{ [key in LandUsePlanningCrop]: string }>({} as any);
  const heatmapColors = ['black', 'red', 'yellow', 'white'];
    
  // Preload land use planning images so we can normalize them
  useEffect(() => {
    const preloadAndProcessImages = () => {
      const promises = landUsePlanningCrops.map((crop) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = `${basePath}/demo/ag_tips/${crop}.png`;

          img.onload = () => {
            // Create a canvas to draw and process the image
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Failed to get canvas 2D context");
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            applyHeatMapToImageData(data);
            ctx.putImageData(imageData, 0, 0);

            const scaledCanvas = document.createElement("canvas");
            scaledCanvas.width = img.width * scaleFactor;
            scaledCanvas.height = img.height * scaleFactor;
            const scaledCtx = scaledCanvas.getContext("2d");

            if (!scaledCtx) {
                throw new Error("Failed to get scaled canvas 2D context");
            }
              
            scaledCtx.imageSmoothingEnabled = false;
            scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
            const processedImageUrl = scaledCanvas.toDataURL();
            setLandUsePlanningImages(prev => ({ ...prev, [crop]: processedImageUrl }));
  
            resolve();
          };

          img.onerror = () => {
            console.error(`Failed to load image for ${crop}`);
            reject();
          };
        });
      });

      Promise.all(promises)
        .catch((err) => console.error("Error preloading and processing images:", err));
    };

    preloadAndProcessImages();
  }, []);

  const applyHeatMapToImageData = (data: TypedArray) => {
    const heatMapScale = chroma.scale(heatmapColors).correctLightness().domain([0, 1]);
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const normalized = brightness / 255;
      const heatColor = heatMapScale(normalized).rgb(); // Returns [r, g, b]
      data[i] = heatColor[0];     // Red
      data[i + 1] = heatColor[1]; // Green
      data[i + 2] = heatColor[2]; // Blue
    }
  };

  const currentThreshold = landUsePlanningThresholds[selectedLandUsePlanningCrop];
    
  const ColorBar: React.FC<ColorBarProps>  = ({ vmin, vmax, numIntervals = 5 }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const getIntermediateValues = (vmin: number, vmax: number, numIntervals: number) => {
      const step = (vmax - vmin) / (numIntervals - 1);
      const values = [];
      for (let i = 0; i < numIntervals; i++) {
        values.push(vmin + i * step);
      }
      return values;
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }
        
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas 2D context");
      }

      const scale = chroma.scale(heatmapColors).domain([vmax, vmin]);
      for (let y = 0; y < canvas.height; y++) {
        const value = vmin + ((vmax - vmin) * (y / canvas.height));
        const color = scale(value).hex();
        ctx.fillStyle = color;
        ctx.fillRect(0, y, canvas.width, 1);
      }
    }, [vmin, vmax]);

    const intermediateValues = getIntermediateValues(vmin, vmax, numIntervals);

    return (
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={30} height={300} />
        <div className="flex flex-col justify-between ml-2">
          {intermediateValues.reverse().map((value, index) => (
            <span key={index}>{value.toFixed(1)}</span>
          ))}
        </div>
      </div>
    );
  };
    
  const commonCropRotations = {
      'Flaxseed': [['Flaxseed', 'Flaxseed'], ['Flaxseed', 'Grass'], ['Flaxseed', 'Barley', 'Grass']], 
      'Wheat': [['Wheat', 'Fallow'], ['Wheat', 'Legume'], ['Wheat', 'Canola', 'Barley'], ['Wheat', 'Soybeans', 'Corn']],
      'Barley': [['Barley', 'Fallow'], ['Barley', 'Peas']], 
      'Oats': [['Oats', 'Soybeans', 'Corn'], ['Oats', 'Canola', 'Wheat'], ['Oats', 'Flaxseed', 'Oats']], 
      'Canola': [['Canola', 'Fallow'], ['Canola', 'Legume'], ['Canola', 'Wheat', 'Barley']], 
      'Peas': [['Peas', 'Oats', 'Corn'], ['Peas', 'Flaxseed', 'Peas']], 
      'Corn':[['Corn', 'Fallow'], ['Corn', 'Soybeans'], ['Corn', 'Wheat', 'Clover']], 
      'Soy': [['Soy', 'Fallow'], ['Soy', 'Corn'], ['Soy', 'Wheat', 'Canola']]
  }
    
  return (
    <div className={`${roboto.className} bg-accent-light text-black`}>
      <div className="relative m-4">
        <Container className="mb-4">
          <section id="summary">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
              Summary
            </div>
            <div className="w-full sm:flex flex-row">
              <div className="w-[46%] p-4">
                <p className="mb-2 text-accent text-xl text-center">This is a demo address!</p>
                <AddressDisplay 
                  addressComponents={addressComponents} 
                  latitude={lat} 
                  longitude={lng} 
                />
              </div>
              <div className="w-[54%] p-4">
                <SummaryScore />
              </div>
            </div>
          </section>
          <div className="flex justify-center space-x-4 border-b border-accent-dark mb-4 mt-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-t-lg ${
                  activeTab === tab ? 'bg-accent-dark text-white' : 'text-black'
                } hover:bg-accent-dark hover:opacity-75 hover:text-white`}
              >
                {tab.replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
          <div>{renderActiveComponent()}</div>
        </Container>
      </div>
    </div>
  );
}
