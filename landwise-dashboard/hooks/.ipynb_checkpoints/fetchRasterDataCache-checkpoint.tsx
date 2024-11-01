import { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import { valuesToNames } from '@/types/valuesToNames';
import { majorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';
import { fromArrayBuffer } from "geotiff";
import { getAvg, getStd } from '@/utils/stats';
import { getHeatMapUrl } from '@/utils/imageUrl';

const scaleFactor=10;
const metersPerPixel = 30;

export const fetchRasterDataCache = (basePath: string) => {
  const [rasterDataCache, setRasterDataCache] = useState<Record<number, any>>({});

  useEffect(() => {
    const fetchYearlyRasterData = async () => {
      const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
      const rasterDataForYears: Record<number, any> = {};
      try {
        for (const yr of years) {
          const rasterFile = `${basePath}/demo/raster_data/${yr}.tif`;
          const { image } = await fetchRasterImage(rasterFile);
          const data = await fetchYearlyData(image);
          rasterDataForYears[yr] = data;
        }
        setRasterDataCache(prev => ({
          ...prev,
          ...rasterDataForYears
        }));
      } catch (error) {
        console.error('Error fetching raster data:', error);
      }
    };
      
    const fetchElevationRasterData = async () => {
      try {
        const rasterFile = `${basePath}/demo/raster_data/elevation.tif`;
        const { image } = await fetchRasterImage(rasterFile);
        const data = await fetchElevationData(image);
          
        setRasterDataCache(prev => ({
          ...prev,
          elevation: data
        }));
      } catch (error) {
        console.error('Error fetching raster data:', error);
      }
    };
  
      
    fetchYearlyRasterData();
    fetchElevationRasterData();
  }, [basePath]);

  return rasterDataCache;
};

const colors = chroma.scale('Set1').colors(Object.keys(valuesToNames).length);

// Function to fetch and process the raster data
const fetchRasterImage = async (url: string) => {
  // Fetch and parse the TIFF raster data
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);

  const arrayBuffer = await response.arrayBuffer();
  const tiff = await fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  return { image };
};

const fetchYearlyData = async (image: any) => {
  const data: TypedArray[] = await image.readRasters() as TypedArray[];
  const flattenedData = Array.from(data[0]);

  // Count occurrences of each value
  const counts: Record<number, number> = {};
  flattenedData.forEach((value) => {
    counts[value] = (counts[value] || 0) + 1;
  });
    
  // Remove values that are only present less than 2% of the time
  const totalValues = flattenedData.length;
  const threshold = totalValues * 0.02;
    
  flattenedData.forEach((value, index) => {
    if (counts[value] < threshold) {
      flattenedData[index] = 0;
    }
  });

  // Initialize counters for total area and usable land pct
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

  const usableLandPct = cropSum / totalSum;
  const area = totalSum;

  // Generate image URL and legend
  const width = image.getWidth();
  const height = image.getHeight();
  const imageUrl = await yearlyDataToImageURL(flattenedData, width, height);
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

  return { imageUrl, legend, bbox, usableLandPct, area, majorCommodityCropsGrown };
};

const yearlyDataToImageURL = (rasterData: any, width: number, height: number) => {
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

const fetchElevationData = async (image: any) => {
  const data: TypedArray[] = await image.readRasters() as TypedArray[];
  const flattenedData = Array.from(data[0]);
  const width = image.getWidth();
  const height = image.getHeight();

  // Remove nans and zeros from calculations
  const validData = flattenedData.filter((value) => !isNaN(value) && value !== null && value !== 0);

  const minElevation = Math.min(...validData);
  const maxElevation = Math.max(...validData);
  const avgElevation = getAvg(validData);
  const stdElevation = getStd(validData);
  const elevationColorScale = chroma.scale(['blue', 'green', 'yellow', 'brown']).domain([minElevation, maxElevation]);
  const elevationUrl = await getHeatMapUrl(flattenedData, 
                                           width, 
                                           height, 
                                           0, 
                                           elevationColorScale,
                                           scaleFactor);

  // console.log(minElevation, maxElevation, avgElevation, stdElevation);
      
  const { slope, minSlope, maxSlope, avgSlope, stdSlope, aspect } = calculateSlope(flattenedData, width, height);
  const slopeColorScale = chroma.scale(['blue', 'green', 'yellow', 'brown']).domain([minSlope, maxSlope]);
  const slopeUrl = await getHeatMapUrl(slope, 
                                       width-2, 
                                       height-2, 
                                       null, 
                                       slopeColorScale,
                                       scaleFactor);

    
  const { convexity, minConvexity, maxConvexity, avgConvexity, stdConvexity } = calculateConvexity(flattenedData, width, height);
  const convexityColorScale = chroma.scale(['blue', 'green', 'yellow', 'brown']).domain([minConvexity, maxConvexity]);
  const convexityUrl = await getHeatMapUrl(convexity, 
                                           width-2, 
                                           height-2, 
                                           null, 
                                           convexityColorScale,
                                           scaleFactor);
      
  const bbox = image.getBoundingBox();

  // returning raw slope and aspect data, as well as width and heigh as they are needed with wind speeds 
  // and directions to calculate wind exposure risk, which then gets converted to an image
  return { bbox, slope, aspect, width, height,
           elevationUrl, avgElevation, stdElevation, minElevation, maxElevation, 
           slopeUrl, avgSlope, stdSlope, minSlope, maxSlope, 
           convexityUrl, avgConvexity, stdConvexity, minSlope, maxSlope };
};

function calculateSlope(elevationData: number[], width: number, height: number) {
  const slope: (number | null)[] = [];
  const aspect: (number | null)[] = [];
  let minSlope: number | null = null;
  let maxSlope: number | null = null;

  function getElevation(i: number, j: number) {
    const index = i * width + j;
    return elevationData[index] ?? NaN; // Handle any invalid index by returning NaN
  }

  if (metersPerPixel === 0 || isNaN(metersPerPixel)) {
    console.error("Invalid metersPerPixel value:", metersPerPixel);
    return { slope: [], minSlope: null, maxSlope: null };
  }

  for (let i = 1; i < height - 1; i++) {
    for (let j = 1; j < width - 1; j++) {
      const p = getElevation(i, j);
      const pl = getElevation(i, j - 1);
      const pr = getElevation(i, j + 1);
      const pu = getElevation(i - 1, j);
      const pd = getElevation(i + 1, j);

      // Check if any of the elevations are 0
      if ([p, pl, pr, pu, pd].some(val => val === 0)) {
        slope.push(null);
        aspect.push(null);
        continue;
      }

      const slopeX = (pr - pl) / (2 * metersPerPixel);
      const slopeY = (pd - pu) / (2 * metersPerPixel);
      const overallSlope = Math.sqrt(Math.pow(slopeX, 2) + Math.pow(slopeY, 2));
      const slopeAspect = Math.atan2(slopeY, slopeX) * (180 / Math.PI);
      const normalizedAspect = slopeAspect >= 0 ? slopeAspect : slopeAspect + 360; // 0 - 360 degrees
        
      if (!isNaN(overallSlope)) {
        if (minSlope === null || overallSlope < minSlope) {
          minSlope = overallSlope;
        }
        if (maxSlope === null || overallSlope > maxSlope) {
          maxSlope = overallSlope;
        }
        slope.push(overallSlope);
        aspect.push(normalizedAspect);
      } else {
        console.warn("Invalid slope value at", { i, j, overallSlope });
        slope.push(null);
        aspect.push(null);
      }
    }
  }
  const avgSlope = getAvg(slope);
  const stdSlope = getStd(slope);

  return { slope, minSlope, maxSlope, avgSlope, stdSlope, aspect };
}


function calculateConvexity(elevationData: number[], width: number, height: number) {
  const convexity: (number | null)[] = [];
  let minConvexity: number | null = null;
  let maxConvexity: number | null = null;

  function getElevation(i: number, j: number) {
    const index = i * width + j;
    return elevationData[index] ?? NaN;

  }
    
  for (let i = 1; i < height - 1; i++) {
    for (let j = 1; j < width - 1; j++) {
      const p = getElevation(i, j);
      const pl = getElevation(i, j - 1);
      const pr = getElevation(i, j + 1);
      const pu = getElevation(i - 1, j);
      const pd = getElevation(i + 1, j);

      // Check if any of the elevations are 0
      if ([p, pl, pr, pu, pd].some(val => val === 0)) {
        convexity.push(null);
        continue;
      }

      const secondDerivativeX = (pr - 2 * p + pl) / Math.pow(metersPerPixel, 2);
      const secondDerivativeY = (pd - 2 * p + pu) / Math.pow(metersPerPixel, 2);
      const xyconvexity = secondDerivativeX + secondDerivativeY;
        
      if (minConvexity === null || xyconvexity < minConvexity) {
        minConvexity = xyconvexity;
      }
      if (maxConvexity === null || xyconvexity > maxConvexity) {
        maxConvexity = xyconvexity;
      }
      convexity.push(xyconvexity);
    }
  }

  const avgConvexity = getAvg(convexity);
  const stdConvexity = getStd(convexity);
    
  return { convexity, minConvexity, maxConvexity, avgConvexity, stdConvexity };
}
