import { useState, useEffect } from 'react';
import chroma from 'chroma-js';

export const fetchCropHeatMaps = (basePath: string) => {
  const [landUsePlanningImages, setLandUsePlanningImages] = useState<{ [key in LandUsePlanningCrop]: string }>({} as any);
  const landUsePlanningCrops: LandUsePlanningCrop[] = ["Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy"];
  const scaleFactor=10;

  useEffect(() => {
    const preloadAndProcessImages = () => {
      const promises = landUsePlanningCrops.map((crop) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = `${basePath}/demo/ag_tips/${crop}.png`;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) throw new Error("Failed to get canvas 2D context");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            applyHeatMapToImageData(data);
            ctx.putImageData(imageData, 0, 0);

            const scaledCanvas = document.createElement("canvas");
            scaledCanvas.width = img.width * scaleFactor;
            scaledCanvas.height = img.height * scaleFactor;
            const scaledCtx = scaledCanvas.getContext("2d");

            if (!scaledCtx) throw new Error("Failed to get scaled canvas 2D context");

            scaledCtx.imageSmoothingEnabled = false;
            scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
            const processedImageUrl = scaledCanvas.toDataURL();
            setLandUsePlanningImages(prev => ({ ...prev, [crop]: processedImageUrl }));
  
            resolve();
          };

          img.onerror = () => {
            console.error(`Failed to load image for ${crop}`);
            reject();
          };
        });
      });

      Promise.all(promises).catch((err) => console.error("Error preloading and processing images:", err));
    };

    preloadAndProcessImages();
  }, [basePath]);

  return landUsePlanningImages;
};

// Helper function to apply heat map to the image data
const applyHeatMapToImageData = (data: TypedArray) => {
  const heatmapColors = ['black', 'red', 'yellow', 'white'];
  const heatMapScale = chroma.scale(heatmapColors).correctLightness().domain([0, 1]);
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const normalized = brightness / 255;
    const heatColor = heatMapScale(normalized).rgb();
    data[i] = heatColor[0];
    data[i + 1] = heatColor[1];
    data[i + 2] = heatColor[2];
  }
};
