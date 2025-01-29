// NOTE: These functions are for use on the server side
// processing the data into images and properties

import chroma from 'chroma-js';
import { getStats } from '@/utils/stats';
import { createCanvas, CanvasRenderingContext2D } from "canvas";
import { ImageData } from '@/types/dataTypes';
import { valueToName } from '@/utils/labels';

const scale = 10;

export const getBandImagesLegendsUnique = (
  bands: Record<string, ImageData>,
  labels: Record<number, number | string>[],
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
  labels: Record<number, number | string>[],
  colorSet: string,
) => {
  try {
    const colorScale = chroma.scale(colorSet as any).colors(labels.length);
    const imageUrl = dataToUrl(imageData, null, colorScale);

    const uniqueElements = new Set<number | null>(imageData.sampleData);
    const legend: Record<string, string> = {};      

    uniqueElements.forEach((value) => {
      if (value !== null) {       
        const index = valueToIndex(labels, value);
        const name = labels[index].name;
        if (name && name !== 'NODATA' && name !== 'Cloud' && index >= 0) {
          legend[name] = colorScale(value);
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
      
    const colorScale = chroma.scale(colorPalette).domain([min, max]);

    const imageUrl = dataToUrl(imageData, null, colorScale);
    return { imageUrl, min, max, avg, std };

  } catch (error) {
    console.error('Error in getImageLegendUnique:', error);
  }
};

export function dataToUrl(
  imageData: ImageData,
  transparentVal: number | null,
  colorScale: (value: number) => chroma.Color,
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
      const [r, g, b] = colorScale(value).rgb();
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
