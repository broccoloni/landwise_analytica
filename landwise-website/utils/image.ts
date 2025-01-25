// NOTE: These functions are for use on the server side
// processing the data into images and properties

import chroma from 'chroma-js';
import { getStats } from '@/utils/stats';
import { colorSet, rangeColors } from '@/types/colorPalettes';
import { createCanvas, CanvasRenderingContext2D } from "canvas";
import { Data } from '@/types/dataTypes';

export const getBandImagesLegendsUnique = (
  bands: Record<string, Data>,
  valuesToNames: Record<number, string>,
  scale: number
) => {
  try {
    const newBands: Record<string, { imageUrl: string; legend: Record<string, string>; uniqueElements: Set<number | null> }> = {};
    for (const bandName in bands) {
      newBands[bandName] = getImageLegendUnique(bands[bandName], valuesToNames, scale);
    }
    return newBands;

  } catch (error) {
    console.error('Error in getBandImagesLegendsUnique:', error);
  }
};

export const getImageLegendUnique = (
  data: Data,
  valuesToNames: Record<number, string>,
  scale: number
) => {
  try {
    const { sampleData, width, height } = data;
    const imageUrl = dataToStaticColorUrl(sampleData, width, height, null, valuesToNames, scale);

    const uniqueElements = new Set<number | null>(sampleData);  // Ensure Set type is correct
    const legend: Record<string, string> = {};
    const values = Object.keys(valuesToNames).map((val) => parseInt(val));
    const colors = chroma.scale(colorSet as any).colors(Object.keys(valuesToNames).length);

    uniqueElements.forEach((value) => {
      if (value !== null) {       
        const name = valuesToNames[value];
        const index = values.indexOf(value);
        if (name && name !== 'NODATA' && name !== 'Cloud' && index >= 0) {
          legend[name] = colors[index];
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
  bands: Record<string, Data>,
  scale: number
) => {
  try {
    const newBands: Record<string, { imageUrl: string; min: number, max: number, avg: number, std: number }> = {};
    for (const bandName in bands) {
      const band = getImageAndStats(bands[bandName], scale);
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
  data: Data,
  scale: number
) => {
  try {
    const { sampleData, width, height } = data;
    const { min, max, avg, std } = getStats(sampleData);
    
    const colorScale = chroma.scale(rangeColors).domain([min, max]);
    const imageUrl = dataToColorScaleUrl(sampleData, width, height, null, colorScale, scale);
    
    return { imageUrl, min, max, avg, std };

  } catch (error) {
    console.error('Error in getImageLegendUnique:', error);
  }
};

export function dataToColorScaleUrl(
  data: (number | null)[],
  width: number,
  height: number,
  transparentVal: number | null,
  colorScale: (value: number) => chroma.Color,
  scaleFactor: number
): string {
  // Create base canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const imageData = ctx.createImageData(width, height);

  data.forEach((value, i) => {
    if (value === transparentVal || value === null) {
      imageData.data[i * 4] = 0;
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
      imageData.data[i * 4 + 3] = 0;
    } else {
      const color = colorScale(value).rgb();
      imageData.data[i * 4] = color[0];
      imageData.data[i * 4 + 1] = color[1];
      imageData.data[i * 4 + 2] = color[2];
      imageData.data[i * 4 + 3] = 255;
    }
  });

  ctx.putImageData(imageData, 0, 0);

  if (scaleFactor === 1) {
    return canvas.toDataURL();
  }

  // Draw and scale to final size
  const scaledCanvas = createCanvas(width * scaleFactor, height * scaleFactor);
  const scaledCtx = scaledCanvas.getContext('2d') as CanvasRenderingContext2D;

  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas.toDataURL();
}

export function dataToStaticColorUrl(
  data: (number | null)[],
  width: number,
  height: number,
  transparentVal: number | null,
  valuesToNames: Record<number, string>,
  scaleFactor: number
): string {
  const colors = chroma.scale(colorSet as any).colors(Object.keys(valuesToNames).length);
  const values = Object.keys(valuesToNames).map((val: string) => parseInt(val));

  // Create base canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const imageData = ctx.createImageData(width, height);

  data.forEach((value, i) => {
    if (value === transparentVal || value === null) {
      imageData.data[i * 4] = 0;
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
      imageData.data[i * 4 + 3] = 0;
    } else {
      const colorIndex = values.indexOf(value);
      const [r, g, b] = chroma(colors[colorIndex]).rgb();
      imageData.data[i * 4] = r;
      imageData.data[i * 4 + 1] = g;
      imageData.data[i * 4 + 2] = b;
      imageData.data[i * 4 + 3] = 255;
    }
  });

  ctx.putImageData(imageData, 0, 0);

  if (scaleFactor === 1) {
    return canvas.toDataURL();
  }

  // Draw and scale to final size
  const scaledCanvas = createCanvas(width * scaleFactor, height * scaleFactor);
  const scaledCtx = scaledCanvas.getContext('2d') as CanvasRenderingContext2D;

  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas.toDataURL();
}

