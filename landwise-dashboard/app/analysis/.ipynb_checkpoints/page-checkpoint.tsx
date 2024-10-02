'use client';

import { useSearchParams } from 'next/navigation';
import Nav from '@/components/Nav'; // Import the SidebarNav component
import Container from '@/components/Container';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useRouter } from 'next/navigation';
import AddressSearch from '@/components/AddressSearch';
import MapImage from '@/components/MapImage';
import Trends from '@/components/Trends';
import chroma from 'chroma-js';
import { valuesToNames } from '@/types/valuesToNames';
import { fromArrayBuffer } from "geotiff";
import { useState, useEffect, useRef } from 'react';
import { Slider } from "@mui/material";
import Dropdown from '@/components/Dropdown';
import { MoveRight } from 'lucide-react';

const DEMO_ADDRESS = {
  address: "8159 Side Road 30, Wellington County, Ontario, N0B 2K0, Canada",
  lat: "43.6929954",
  lng: "-80.3071343"
};

export default function Analysis() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get('address');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const scaleFactor=10;
    
  // Callback to handle new selected address in property
  const handleNewAddressSelect = (newAddress: string, newLat: number, newLng: number) => {
    router.push(`/analysis?address=${encodeURIComponent(newAddress)}&lat=${newLat}&lng=${newLng}`);
  };

  // Check if the current address is the demo address
  const isDemoAddress = address === DEMO_ADDRESS.address;

  // Load Raster data
  const rasterDataCache = useRef<Record<number, any>>({});
  const [landHistoryYear, setLandHistoryYear] = useState<number>(2014);
  const [rasterData, setRasterData] = useState<any>(null);
  const colors = chroma.scale('Set1').colors(Object.keys(valuesToNames).length);

  // Fetch raster data for all years on mount
  useEffect(() => {
    const fetchAllRasterData = async () => {
      const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
      const rasterDataForYears: Record<number, any> = {};

      try {
        for (const yr of years) {
          const rasterFile = `/demo/land_history/prior_inventory/${yr}.tif`;
          const data = await fetchRasterData(rasterFile);
          rasterDataForYears[yr] = data;
        }

        // Store all fetched data in cache
        rasterDataCache.current = rasterDataForYears;

        // Set initial year data
        setRasterData(rasterDataForYears[landHistoryYear]);
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
    const data = await image.readRasters();
    const width = image.getWidth();
    const height = image.getHeight();

    const imageUrl = rasterToImageURL(data, width, height);
    const uniqueElements = new Set(data[0]);
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
    ctx.imageSmoothingEnabled = false;

    const imageData = ctx.createImageData(width, height);

    // Fill the imageData with the original raster data
    for (let i = 0; i < rasterData[0].length; i++) {
      const value = rasterData[0][i];
      const index = Object.keys(valuesToNames).findIndex((key) => parseInt(key) === value);
      const color = index !== -1 ? chroma(colors[index]) : chroma('black');
      const [r, g, b] = color.rgb();

      imageData.data[i * 4] = r;
      imageData.data[i * 4 + 1] = g;
      imageData.data[i * 4 + 2] = b;
      imageData.data[i * 4 + 3] = (value === 0 || value === 10) ? 0 : 255; // Set alpha
    }

    // Put the imageData on the canvas at original resolution
    ctx.putImageData(imageData, 0, 0);

    // Create a new canvas to hold the upscaled version
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = width * scaleFactor;
    scaledCanvas.height = height * scaleFactor;
    const scaledCtx = scaledCanvas.getContext("2d");

    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    return scaledCanvas.toDataURL();
  };

  // Update map and legend when the year is changed
  useEffect(() => {
    if (rasterDataCache.current && rasterDataCache.current[landHistoryYear]) {
      setRasterData(rasterDataCache.current[landHistoryYear]);
    }
  }, [landHistoryYear]);

  const handleLandHistoryYearChange = (event: Event, newValue: number) => {
    setLandHistoryYear(newValue);
  };

  // LAND USE PLANNING
  const landUsePlanningCrops = ["Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy"];
  const landUsePlanningThresholds = {
    Flaxseed: { vmin: 56, vmax: 96 },
    Wheat: { vmin: 77, vmax: 117 },
    Barley: { vmin: 61, vmax: 101 },
    Oats: { vmin: 56, vmax: 96 },
    Canola: { vmin: 43, vmax: 83 },
    Peas: { vmin: 66, vmax: 106 },
    Corn: { vmin: 63, vmax: 103 },
    Soy: { vmin: 63, vmax: 103 },
  };
  const [selectedLandUsePlanningCrop, setSelectedLandUsePlanningCrop] = useState(landUsePlanningCrops[0]);
  const [landUsePlanningImages, setLandUsePlanningImages] = useState({});
  // const [imagesLoaded, setImagesLoaded] = useState(false);  // Track when images are loaded
  const heatmapColors = ['blue', 'green', 'yellow', 'red'];
    
  // Preload land use planning images so we can normalize them
  useEffect(() => {
    const preloadAndProcessImages = () => {
      const promises = landUsePlanningCrops.map((crop) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = `/demo/ag_tips/${crop}.png`;

          img.onload = () => {
            // Create a canvas to draw and process the image
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
  
            // Set the canvas size to match the image
            canvas.width = img.width;
            canvas.height = img.height;
  
            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);
  
            // Get the image data (pixel data)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Normalize and apply the heatmap
            applyHeatMapToImageData(data);

            // Put the processed image data back onto the canvas
            ctx.putImageData(imageData, 0, 0);

            // Create a new canvas to hold the upscaled version
            const scaledCanvas = document.createElement("canvas");
            scaledCanvas.width = img.width * scaleFactor;
            scaledCanvas.height = img.height * scaleFactor;
            const scaledCtx = scaledCanvas.getContext("2d");
        
            scaledCtx.imageSmoothingEnabled = false;
            scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

            // Convert the canvas to a data URL and store it
            const processedImageUrl = scaledCanvas.toDataURL();
            setLandUsePlanningImages(prev => ({ ...prev, [crop]: processedImageUrl }));
  
            resolve();  // Resolve the promise after processing
          };

          img.onerror = () => {
            console.error(`Failed to load image for ${crop}`);
            reject();  // Reject if the image fails to load
          };
        });
      });

      // After all images are processed
      Promise.all(promises)
        .then(() => setImagesLoaded(true))
        .catch((err) => console.error("Error preloading and processing images:", err));
    };

    preloadAndProcessImages();
  }, []);

  const applyHeatMapToImageData = (data) => {
    // Create a chroma.js color scale (from blue to red, or you can use others like 'Viridis', 'Inferno', etc.)
    const heatMapScale = chroma.scale(heatmapColors).domain([0, 1]);

    // Loop through each pixel (RGBA format, so steps of 4)
    for (let i = 0; i < data.length; i += 4) {
      // Get the brightness of the pixel (could also use a more advanced method)
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

      // Normalize brightness (0-255 to 0-1 range)
      const normalized = brightness / 255;

      // Get the color from the heat map using chroma.js
      const heatColor = heatMapScale(normalized).rgb(); // Returns [r, g, b]

      // Update pixel data with heatmap color
      data[i] = heatColor[0];     // Red
      data[i + 1] = heatColor[1]; // Green
      data[i + 2] = heatColor[2]; // Blue
    }
  };

  const currentThreshold = landUsePlanningThresholds[selectedLandUsePlanningCrop];
    
const ColorBar = ({ vmin, vmax, numIntervals = 5 }) => {
  const canvasRef = useRef(null);

  // Calculate the intermediate values based on vmin and vmax
  const getIntermediateValues = (vmin, vmax, numIntervals) => {
    const step = (vmax - vmin) / (numIntervals - 1);  // Divide the range into equal steps
    const values = [];
    for (let i = 0; i < numIntervals; i++) {
      values.push(vmin + i * step);  // Calculate each intermediate value
    }
    return values;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Create a chroma.js scale for the color bar (from vmax to vmin)
    const scale = chroma.scale(heatmapColors).domain([vmax, vmin]); // Reverse the order here

    // Draw the vertical color bar gradient
    for (let y = 0; y < canvas.height; y++) {
      // Calculate the corresponding value in the [vmin, vmax] range
      const value = vmin + ((vmax - vmin) * (y / canvas.height));
      const color = scale(value).hex();  // Get color for the value

      // Draw the color for this section of the bar
      ctx.fillStyle = color;
      ctx.fillRect(0, y, canvas.width, 1);  // Draw a 1px wide line across the canvas width
    }
  }, [vmin, vmax]);

  const intermediateValues = getIntermediateValues(vmin, vmax, numIntervals);

  return (
    <div className="flex justify-center">
      {/* Render the vertical color bar */}
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
            {isDemoAddress && (
              <p className="mb-2 text-accent text-xl text-center">This is the demo address!</p>
            )}
            <p className="mb-2">Address: {address}</p>
            <p className="mb-2">Latitude: {lat}</p>
            <p className="mb-2">Longitude: {lng}</p>
            <div className="mt-8">
              <AddressSearch onAddressSelect={handleNewAddressSelect} prompt="Search for a new address" />
            </div>
          </section>
        </Container>

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
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={rasterData.bbox} imageUrl={rasterData.imageUrl} />
                ) : (
                  <div className="text-center text-gray-500">No map data available.</div>
                )}
              </div>
              <div className="w-32 pl-4">
                {/* Legend */}
                <div className="legend">
                  <div className={`${merriweather.className} text-center mb-2 font-medium`}>Legend</div>
                  {rasterData?.legend ? (
                    Object.keys(rasterData.legend).map((key) => (
                      <div key={key} className="legend-item flex items-center mb-1">
                        <span
                          className="legend-color block w-4 h-4 mr-2"
                          style={{ backgroundColor: rasterData.legend[key] }}
                        ></span>
                        <span className="legend-label">{key}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">No legend available.</div>
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
          <section id="agriculture-tips">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
              Agriculture Tips
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
                  <MapImage 
                    latitude={lat} 
                    longitude={lng} 
                    zoom={15} 
                    bbox={rasterData.bbox} 
                    imageUrl={landUsePlanningImages[selectedLandUsePlanningCrop]} 
                  />
                ) : (
                  <div className="text-center text-gray-500">No map data available.</div>
                )}
              </div>
              <div className="w-32 pl-4">
                {/* Legend */}
                <div className="flex-row justify-center items-center text-center">
                  <div className={`text-center mb-2 font-medium`}>
                      Yield (Bushels/Acre)
                  </div>
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
                {commonCropRotations[selectedLandUsePlanningCrop]?.map(rotation => {
                  return (
                    <li key={rotation} className="mb-1">
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
      </div>
    </div>
  );
}
