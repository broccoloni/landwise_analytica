'use client';

import { useSearchParams } from 'next/navigation';
import Nav from '@/components/Nav'; // Import the SidebarNav component
import Container from '@/components/Container';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useRouter } from 'next/navigation';
import AddressSearch from '@/components/AddressSearch';
import MapImage from '@/components/MapImage';
import Trends from '@/components/Trends';
import LandUsePlanning from '@/components/LandUsePlanning';
import chroma from 'chroma-js';
import { valuesToNames } from '@/types/valuesToNames';
import { fromArrayBuffer } from "geotiff";
import { useState, useEffect, useRef } from 'react';
import { Slider } from "@mui/material";
import Dropdown from '@/components/Dropdown';

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

  const rasterToImageURL = (rasterData: any, width: number, height: number, scaleFactor = 5) => {
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
  const landUsePlanningImages = useRef({}); //crop name: imageUrl    
  const [selectedLandUsePlanningCrop, setSelectedLandUsePlanningCrop] = useState(landUsePlanningCrops[0]);
  const [landUsePlanningImage, setLandUsePlanningImage] = useState(null);
  const [landusePlanningThreshold, setLandUsePlanningThreshold] = useState(landUsePlanningThresholds[landUsePlanningCrops[0]]);

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
          <section id="land-use-planning">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
              Land Use Planning
            </div>
            <Dropdown 
              options={landUsePlanningCrops} 
              selected={selectedLandUsePlanningCrop} 
              onSelect={setSelectedLandUsePlanningCrop} 
            />

            <div className = "flex mt-8">
              <div className="w-full">
                {/* Image on Map */}
                {rasterData?.bbox && rasterData?.imageUrl ? (
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={rasterData.bbox} imageUrl={`/demo/ag_tips/${selectedLandUsePlanningCrop}.png`} />
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
      </div>
    </div>
  );
}
