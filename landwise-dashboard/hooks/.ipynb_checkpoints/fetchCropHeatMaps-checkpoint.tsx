import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { majorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';

const majorCommodityThresholds: Record<majorCommodityCrop, { vmin: number; vmax: number }> = {
  Flaxseed: { vmin: 56, vmax: 96 },
  Wheat: { vmin: 77, vmax: 117 },
  Barley: { vmin: 61, vmax: 101 },
  Oats: { vmin: 56, vmax: 96 },
  Canola: { vmin: 43, vmax: 83 },
  Peas: { vmin: 66, vmax: 106 },
  Corn: { vmin: 63, vmax: 103 },
  Soy: { vmin: 63, vmax: 103 },
};

export const fetchCropHeatMaps = (basePath: string) => {
  const [cropData, setCropData] = useState<{majorCommodityCrop : string }>({} as any);
  const scaleFactor=10;

  useEffect(() => {
    const preloadAndProcessData = () => {
      const promises = majorCommodityCrops.map((crop) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = `${basePath}/demo/crop_heat_maps/${crop}.png`;
    
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
    
            if (!ctx) throw new Error("Failed to get canvas 2D context");
    
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
    
            // Asynchronously process data to avoid blocking
            setTimeout(() => {
              const { min, max, average, stdDev, range, thresholdMin, thresholdMax } = processData(data, crop);
              ctx.putImageData(imageData, 0, 0);
    
              const scaledCanvas = document.createElement("canvas");
              scaledCanvas.width = img.width * scaleFactor;
              scaledCanvas.height = img.height * scaleFactor;
              const scaledCtx = scaledCanvas.getContext("2d");
    
              if (!scaledCtx) throw new Error("Failed to get scaled canvas 2D context");
    
              scaledCtx.imageSmoothingEnabled = false;
              scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

              const processedImageUrl = scaledCanvas.toDataURL();
    
              setCropData((prev) => ({
                ...prev,
                [crop]: { imageUrl: processedImageUrl, min, max, average, stdDev, range, thresholdMin, thresholdMax },
              }));
    
              resolve();
            }, 0);
    
          };
    
          img.onerror = () => {
            console.error(`Failed to load image for ${crop}`);
            reject();
          };
        });
      });
    
      Promise.all(promises).catch((err) => console.error("Error preloading and processing images:", err));
    };

      

    preloadAndProcessData();
  }, [basePath]);

  return cropData;
};

// Helper function to apply heat map to the image data
const processData = (data: TypedArray, crop: majorCommodityCrop) => {
  const heatmapColors = ['black', 'red', 'yellow', 'white'];
  const heatMapScale = chroma.scale(heatmapColors).correctLightness().domain([0, 1]);
  const yields: number[] = [];
  const { vmin: thresholdMin, vmax: thresholdMax } = majorCommodityThresholds[crop];
  const range = thresholdMax - thresholdMin;
  
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const normalized = brightness / 255;
    yields.push(normalized * range + thresholdMin);
    
    const heatColor = heatMapScale(normalized).rgb();
    data[i] = heatColor[0];
    data[i + 1] = heatColor[1];
    data[i + 2] = heatColor[2];
  }

  // Calculate stats based on normalized values
  const min = Math.min(...yields);
  const max = Math.max(...yields);
  const total = yields.reduce((sum, val) => sum + val, 0);
  const average = total / yields.length;
  const variance = yields.reduce((sum, val) => sum + (val - average) ** 2, 0) / yields.length;
  const stdDev = Math.sqrt(variance);

  // Ensure no NaNs are returned
  if (isNaN(min) || isNaN(max) || isNaN(average) || isNaN(stdDev)) {
    console.error('processData is returning NaN values');
  }

  return { min, max, average, stdDev, range, thresholdMin, thresholdMax };
};