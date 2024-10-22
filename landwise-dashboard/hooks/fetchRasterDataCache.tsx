import { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import { valuesToNames } from '@/types/valuesToNames';
import { majorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';
import { fromArrayBuffer } from "geotiff";

export const fetchRasterDataCache = (basePath: string) => {
  const [rasterDataCache, setRasterDataCache] = useState<Record<number, any>>({});

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
  }, [basePath]);

  return rasterDataCache;
};

  const colors = chroma.scale('Set1').colors(Object.keys(valuesToNames).length);

// Function to fetch and process the raster data
const fetchRasterData = async (url: string) => {
  // Fetch and parse the TIFF raster data
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);

  const arrayBuffer = await response.arrayBuffer();
  const tiff = await fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const data: TypedArray[] = await image.readRasters() as TypedArray[];
  const width = image.getWidth();
  const height = image.getHeight();

  // Flatten the raster data array
  const flattenedData = Array.from(data[0]);

  // Count occurrences of each value
  const counts: Record<number, number> = {};
  flattenedData.forEach((value) => {
    counts[value] = (counts[value] || 0) + 1;
  });
    
  // Remove values that are only present less than 2% of the time
  const totalValues = flattenedData.length;
  const threshold = totalValues * 0.02;

  console.log("Counts:", counts);
  console.log("Threshold:", threshold);
    
  flattenedData.forEach((value, index) => {
    if (counts[value] < threshold) {
      flattenedData[index] = 0;
    }
  });

  // Initialize counters for total and farmable area
  let totalSum = 0;
  let cropSum = 0;
  const majorCommodityCropsGrown: string[] = [];

  // Calculate the total area and the area used for major commodity crops
  Object.keys(counts).forEach((key) => {
    const numericKey = parseInt(key);
    const commodityName = valuesToNames[numericKey];

    if (majorCommodityCrops.includes(commodityName)) {
      const cropCount = counts[numericKey];
      cropSum += cropCount; 
      if (!majorCommodityCropsGrown.includes(commodityName) && cropCount >= threshold) {
        majorCommodityCropsGrown.push(commodityName);
      }
    }
    if (numericKey != 0) {
      totalSum += counts[numericKey];
    }
  });

  const farmablePct = cropSum / totalSum;
  const area = totalSum;

  // Generate image URL and legend
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

  return { imageUrl, legend, bbox, farmablePct, area, majorCommodityCropsGrown };
};


// Function to convert raster data into an image URL
const rasterToImageURL = (rasterData: any, width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const scaleFactor=10;
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
