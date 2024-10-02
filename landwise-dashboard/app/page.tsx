'use client';

import Nav from '@/components/Nav';
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

const basePath = '/landwise_analytica';
// const basePath = '';

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
  lng: "-80.3071343"
};

export default function Home() {
  const router = useRouter();
  const scaleFactor=10;
  const isDemoAddress = true;
  const address = DEMO_ADDRESS.address;
  const lat = DEMO_ADDRESS.lat;
  const lng = DEMO_ADDRESS.lng;

  // const [isDemoAddress, setIsDemoAddress] = useState<boolean>(false);
  // const [address, setAddress] = useState<string | null>(null);
  // const [lat, setLat] = useState<string | null>(null);
  // const [lng, setLng] = useState<string | null>(null);

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const queryAddress = searchParams.get('address');
  //   const queryLat = searchParams.get('lat');
  //   const queryLng = searchParams.get('lng');

  //   setAddress(queryAddress);
  //   setLat(queryLat);
  //   setLng(queryLng);

  //   if (queryAddress === DEMO_ADDRESS.address) {
  //     setIsDemoAddress(true);
  //   } else {
  //     setIsDemoAddress(false);
  //   }
  // }, []);

    
  // const handleNewAddressSelect = (newAddress: string, newLat: number, newLng: number) => {
  //   router.push(`/analysis?address=${encodeURIComponent(newAddress)}&lat=${newLat}&lng=${newLng}`);
  // };

  const [landHistoryYear, setLandHistoryYear] = useState<number>(2014);
  const [rasterDataCache, setRasterDataCache] = useState<Record<number, any>>({});
  const colors = chroma.scale('Set1').colors(Object.keys(valuesToNames).length);
  const rasterData = rasterDataCache[landHistoryYear];
    
  useEffect(() => {
    const fetchAllRasterData = async () => {
      const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
      const rasterDataForYears: Record<number, any> = {};
      try {
        for (const yr of years) {
          const rasterFile = `${basePath}/demo/land_history/prior_inventory/${yr}.tif`;
          const data = await fetchRasterData(rasterFile);
          rasterDataForYears[yr] = data;
        }
        setRasterDataCache(rasterDataForYears);
      } catch (error) {
        console.error('Error fetching raster data:', error);
      }
    };
    fetchAllRasterData();
  }, []);

  const fetchRasterData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const arrayBuffer = await response.arrayBuffer();
    const tiff = await fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const data: TypedArray[] = await image.readRasters() as TypedArray[]; 
    const width = image.getWidth();
    const height = image.getHeight();

    const flattenedData = Array.from(data[0]);
    const counts: Record<number, number> = {};
    flattenedData.forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });

    // Calculate the threshold for 1% of the total values
    const totalValues = flattenedData.length;
    const threshold = totalValues * 0.011;
    flattenedData.forEach((value, index) => {
      if (counts[value] < threshold) {
        flattenedData[index] = 0;
      }
    });

    const imageUrl = rasterToImageURL(flattenedData, width, height);
    const uniqueElements = new Set(flattenedData);
    const legend: Record<string, string> = {};
    
    uniqueElements.forEach((value) => {
      const name = valuesToNames[value];
      if (name && name !== 'Cloud') {
        const index = Object.keys(valuesToNames).findIndex((key) => parseInt(key) === value);
        legend[name] = colors[index];
      }
    });
    const bbox = image.getBoundingBox();

    return { imageUrl, legend, bbox };
  };

  const rasterToImageURL = (rasterData: any, width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas 2D context");
    }
       
    ctx.imageSmoothingEnabled = false;
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < rasterData.length; i++) {
      const value = rasterData[i];
      const index = Object.keys(valuesToNames).findIndex((key) => parseInt(key) === value);
      const color = index !== -1 ? chroma(colors[index]) : chroma('black');
      const [r, g, b] = color.rgb();
      imageData.data[i * 4] = r;
      imageData.data[i * 4 + 1] = g;
      imageData.data[i * 4 + 2] = b;
      imageData.data[i * 4 + 3] = (value === 0 || value === 10) ? 0 : 255; // Set alpha
    }
    ctx.putImageData(imageData, 0, 0);

    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = width * scaleFactor;
    scaledCanvas.height = height * scaleFactor;
    const scaledCtx = scaledCanvas.getContext("2d");

    if (!scaledCtx) {
        throw new Error("Failed to get scaled canvas 2D context");
    }

    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    return scaledCanvas.toDataURL();
  };

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
          <section id="property">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
              Property
            </div>
            <div className="sm:flex flex-row">
              <div className="w-full">
                {isDemoAddress ? (
                  <p className="mb-2 text-accent text-xl text-center">This is a demo address!</p>
                ) : (
                  <div className="flex w-full justify-center">
                    <button
                      className="flex items-center p-2"
                      onClick={() =>
                        router.push(
                          `/analysis?address=${encodeURIComponent(
                            DEMO_ADDRESS.address
                          )}&lat=${DEMO_ADDRESS.lat}&lng=${DEMO_ADDRESS.lng}`
                        )
                      }
                    >
                      <div className="flex bg-accent-medium text-white py-2 px-4 rounded-lg">
                        <p className="mr-2">Please Use The Demo Address</p>
                        <ArrowRight />
                      </div>
                    </button>   
                  </div>
                )}
                <>
                  <p className="mb-2">Address: {address}</p>
                  <p className="mb-2">Latitude: {lat}</p>
                  <p className="mb-2">Longitude: {lng}</p>
                </>
              </div>
              <div className="sm:ml-4 sm:mt-0 mt-4">
                <NextImage
                  src={`${basePath}/farm.png`}
                  alt="Photo of Property"
                  width={512}
                  height={512}
                  quality={50}
                  priority
                />
              </div>
            </div>
          </section>
        </Container>

        {isDemoAddress && (
          <>
            <Container className="mb-4">
              <section id="land-history">
                <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                  Historical Land Use
                </div>
    
                {/* Land History Year Slider */}
                <div className="flex justify-center items-left">
                  <div className="mr-4">Select The Year</div>
                  <div className="controls w-32">
                    <Slider
                      value={landHistoryYear}
                      onChange={handleLandHistoryYearChange}
                      min={2014}
                      max={2021}
                      step={1}
                      valueLabelDisplay="auto"
                      marks
                    />
                  </div>
                </div>
    
                <div className = "flex">
                  <div className="w-full">
                    {/* Image on Map */}
                    {rasterData?.bbox && rasterData?.imageUrl ? (
                      <>
                        <MapImage latitude={lat} longitude={lng} zoom={15} bbox={rasterData.bbox} imageUrl={rasterData.imageUrl} />
                      </>
                    ) : (
                      <div className="flex justify-center h-full w-full my-20">
                        <Loader2 className="h-20 w-20 animate-spin text-black" />
                      </div>
                    )}
                  </div>
                  <div className="w-32 pl-4">
                    {/* Legend */}
                    <div className="legend">
                      {rasterData?.legend && (
                        <>
                          <div className={`${merriweather.className} text-center mb-2 font-medium`}>Legend</div>
                          {Object.keys(rasterData.legend).map((key) => (
                            <div key={key} className="legend-item flex items-center mb-1">
                              <span
                                className="legend-color block w-4 h-4 mr-2"
                                style={{ backgroundColor: rasterData.legend[key] }}
                              ></span>
                              <span className="legend-label">{key}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </Container>
    
            <Container className="mb-4">
              <section id="trends">
                <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                  Trends
                </div>
                <Trends />
              </section>
            </Container>
    
            <Container>
              <section id="agriculture-insights">
                <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                  Agriculture Insights
                </div>
                <div className="flex items-center justify-center mb-2">
                  <div className={`${roboto.className} mr-2 mb-0`}>
                    Estimated Land Suitability of:
                  </div>              
                  <Dropdown 
                    options={landUsePlanningCrops} 
                    selected={selectedLandUsePlanningCrop} 
                    onSelect={setSelectedLandUsePlanningCrop} 
                  />
                </div>
                  
                <div className = "flex mb-4">
                  <div className="w-full">
                    {/* Image on Map */}
                    {rasterData?.bbox && rasterData?.imageUrl ? (
                      <>
                        <MapImage 
                          latitude={lat} 
                          longitude={lng} 
                          zoom={15} 
                          bbox={rasterData.bbox} 
                          imageUrl={landUsePlanningImages[selectedLandUsePlanningCrop]} 
                        />
                      </>
                    ) : (
                      <div className="flex justify-center h-full w-full my-20">
                        <Loader2 className="h-20 w-20 animate-spin text-black" />
                      </div>
                    )}
                  </div>
                  <div className="w-32 pl-4">
                    {/* Legend */}
                    <div className="flex-row justify-center items-center text-center font-medium">
                      <p className={`${merriweather.className}`}>
                        Yield 
                      </p>
                      <p className="mb-2">(Bushels/Acre)</p>
                      <ColorBar 
                        vmin={currentThreshold.vmin} 
                        vmax={currentThreshold.vmax} 
                      />
                    </div>
                  </div>
                </div>
    
                <div className="ml-4">
                  <div className={`${montserrat.className} font-lg mb-2`}>
                    {`Common crop rotations for ${selectedLandUsePlanningCrop}:`}
                  </div>
                  <ul className="ml-4">
                    {commonCropRotations[selectedLandUsePlanningCrop]?.map((rotation,index) => {
                      return (
                        <li key={index} className="mb-1">
                          {Array.isArray(rotation) ? (
                            rotation.map((crop, i) => (
                              <span key={i}>
                                {crop}
                                {i < rotation.length - 1 && <MoveRight className="inline-block mx-1" />}
                              </span>
                            ))
                          ) : (
                            <span>{rotation}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>  
              </section>
            </Container>
          </>
        )}
      </div>
    </div>
  );
}
