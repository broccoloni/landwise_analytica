import chroma from 'chroma-js';
import { getStats } from '@/utils/stats';
import { colorSet, rangeColors } from '@/types/colorPalettes';

export const getBandImagesLegendsUnique = (
  bands: Record<string, { sampleData: (number | null)[]; width: number; height: number }>,
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
    console.error('Error in getImageLegendUnique:', error);
  }
};

export const getImageLegendUnique = (
  data: { sampleData: (number | null)[]; width: number; height: number },
  valuesToNames: Record<number, string>,
  scale: number
) => {
  try {
    const { sampleData, width, height } = data;
    const imageUrl = dataToStaticColorUrl(sampleData, width, height, null, valuesToNames, scale);

    const uniqueElements = new Set(sampleData);
    const legend: Record<string, string> = {};
    const values = Object.keys(valuesToNames).map((val) => parseInt(val));
    const colors = chroma.scale(colorSet).colors(Object.keys(valuesToNames).length);

    uniqueElements.forEach((value) => {
      const name = valuesToNames[value];
      const index = values.indexOf(value);
      if (name && name !== 'NODATA' && name !== 'Cloud' && index >= 0) {
        legend[name] = colors[index];
      }
    });

    return { imageUrl, legend, uniqueElements };

  } catch (error) {
    console.error('Error in getImageLegendUnique:', error);
  }
};

export const getBandImagesAndStats = (
  bands: Record<string, { sampleData: (number | null)[]; width: number; height: number }>,
  scale: number
) => {
  try {
    const newBands: Record<string, { imageUrl: string; min: number, max: number, avg: number, std: number }> = {};
    for (const bandName in bands) {
      newBands[bandName] = getImageAndStats(bands[bandName], scale);
    }
    return newBands;
      
  } catch (error) {
    console.error('Error in getImageLegendUnique:', error);
  }
};

export const getImageAndStats = (
  data: { sampleData: (number | null)[]; width: number; height: number },
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
  data: (number|null)[],
  width: number,
  height: number,
  transparentVal: number | null,
  colorScale: (value: number) => chroma.Color,
  scaleFactor: number
): string {

  // console.log("SCALE URL PARAMS:", data, width, height, transparentVal, colorScale, scaleFactor);
    
  // Create base canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas 2D context");

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
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = width * scaleFactor;
  scaledCanvas.height = height * scaleFactor;
  const scaledCtx = scaledCanvas.getContext("2d");
  if (!scaledCtx) throw new Error("Failed to get scaled canvas 2D context");

  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas.toDataURL();
}

export function dataToStaticColorUrl(
  data: (number|null)[],
  width: number,
  height: number,
  transparentVal: number | null,
  valuesToNames: Record<number, string>,
  scaleFactor: number
): string {
  const colors = chroma.scale(colorSet).colors(Object.keys(valuesToNames).length);
  const values = Object.keys(valuesToNames).map((val: string) => parseInt(val));
    
  // Create base canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas 2D context");

  const imageData = ctx.createImageData(width, height);

  data.forEach((value, i) => {
    const colorIndex = values.indexOf(value);
    if (value === transparentVal || value === null || colorIndex < 0 || colorIndex > colors.length) {
      imageData.data[i * 4] = 0;
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
      imageData.data[i * 4 + 3] = 0;
    } else {
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
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = width * scaleFactor;
  scaledCanvas.height = height * scaleFactor;
  const scaledCtx = scaledCanvas.getContext("2d");
  if (!scaledCtx) throw new Error("Failed to get scaled canvas 2D context");

  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas.toDataURL();
}
