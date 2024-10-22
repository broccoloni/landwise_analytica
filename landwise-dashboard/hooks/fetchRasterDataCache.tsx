import { useEffect, useState } from 'react';
import chroma from 'chroma-js';

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

// Function to fetch and process the raster data
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

// Function to convert raster data into an image URL
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
