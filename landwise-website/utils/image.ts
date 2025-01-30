// NOTE: These functions are for use on the server side
// processing the data into images and properties

import chroma from 'chroma-js';
import { getStats } from '@/utils/stats';
import { createCanvas, CanvasRenderingContext2D } from "canvas";
import { ImageData } from '@/types/dataTypes';
import { valueToName, valueToIndex } from '@/utils/labels';

const scale = 10;

export const getBandImagesLegendsUnique = (
  bands: Record<string, ImageData>,
  labels: any[],
  colorSet: string,
) => {
  try {
    const newBands: Record<string, { imageUrl: string; legend: Record<string, string>; uniqueElements: Set<number | null> }> = {};
    for (const bandName in bands) {
      newBands[bandName] = getImageLegendUnique(bands[bandName], labels, colorSet);
    }
    return newBands;

  } catch (error) {
    console.error('Error in getBandImagesLegendsUnique:', error);
  }
};

export const getImageLegendUnique = (
  imageData: ImageData,
  labels: any[],
  colorSet: string,
) => {
  try {
    if (!imageData) {
      throw new Error("Image data not found ");
    }
      
    if (!colorSet) {
      throw new Error("Invalid colorSet");
    }

    if (!Array.isArray(labels) || labels.length === 0) {
      throw new Error("Invalid labels array");
    }
          
    const colorScale = chroma.scale(colorSet as any).colors(labels.length);
      
    // Map image to indexes
    const indexImageData = {
      ...imageData,
      sampleData: imageData.sampleData.map((value: number | null) => valueToIndex(labels, value)),
    };
      
    const imageUrl = dataToUrl(indexImageData, null, colorScale);

    const uniqueElements = new Set<number | null>(indexImageData.sampleData);
    const legend: Record<string, string> = {};      
      
    uniqueElements.forEach((index) => {
      if (index !== null) {       
        const labelEntry = labels[index];
        const name = labelEntry ? labelEntry.name : null;
          
        if (name && name !== 'NODATA' && name !== 'Cloud' && index >= 0) {
          const itemColor = colorScale[index];
          if (itemColor) {
            legend[name] = chroma(itemColor).hex();
          }
        }
      }
    });

    return { imageUrl, legend, uniqueElements };

  } catch (error) {
    console.error('Error in getImageLegendUnique:', error);
    
    // Return the correct type, ensuring legend and uniqueElements match expected types
    return { imageUrl: '', legend: {}, uniqueElements: new Set<number | null>() };
  }
};

export const getBandImagesAndStats = (
  bands: Record<string, ImageData>,
  colorPalette: string[],
) => {
  try {
    const newBands: Record<string, { imageUrl: string; min: number, max: number, avg: number, std: number }> = {};
    for (const bandName in bands) {
      const band = getImageAndStats(bands[bandName], colorPalette);
      if (band) {
        newBands[bandName] = band;
      }
    }
    return newBands;
      
  } catch (error) {
    console.error('Error in getImageLegendUnique:', error);
  }
};

export const getImageAndStats = (
  imageData: ImageData,
  colorPalette: string[],
) => {
  try {
    const { min, max, avg, std } = getStats(imageData.sampleData);
      
    const colorScale = chroma.scale(colorPalette as any).domain([min, max]);

    const imageUrl = dataToUrl(imageData, null, colorScale);
    return { imageUrl, min, max, avg, std, colors: colorPalette };

  } catch (error) {
    console.error('Error in getImageLegendUnique:', error);
  }
};

export function dataToUrl(
  imageData: ImageData,
  transparentVal: number | null,
  colorScale: string[] | ((value: number) => chroma.Color),
): string {
    
  const { sampleData, width, height } = imageData;

  // Create base canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const canvasData = ctx.createImageData(width, height);
    
  sampleData.forEach((value, i) => {
    if (value === transparentVal || value === null) {
      canvasData.data[i * 4] = 0;
      canvasData.data[i * 4 + 1] = 0;
      canvasData.data[i * 4 + 2] = 0;
      canvasData.data[i * 4 + 3] = 0;
    } else {
      const [r, g, b] = Array.isArray(colorScale) ? chroma(colorScale[value]).rgb() : colorScale(value).rgb();
      canvasData.data[i * 4] = r;
      canvasData.data[i * 4 + 1] = g;
      canvasData.data[i * 4 + 2] = b;
      canvasData.data[i * 4 + 3] = 255;
    }
  });

  ctx.putImageData(canvasData, 0, 0);

  // Draw and scale to final size
  const scaledCanvas = createCanvas(width * scale, height * scale);
  const scaledCtx = scaledCanvas.getContext('2d') as CanvasRenderingContext2D;

  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas.toDataURL();
}
