import { useState, useEffect } from 'react';
import { majorCommodityCrops } from '@/types/majorCommodityCrops';
import { CropData } from '@/types/category';

export const useFetchCropHeatMaps = (basePath: string) => {
  const [cropData, setCropData] = useState<CropData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCropHeatMaps = async () => {
      try {
        const promises = majorCommodityCrops.map((crop) => {
          return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.src = `${basePath}/demo/crop_heat_maps/${crop}.png`;

            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              if (!ctx) {
                reject(new Error("Failed to get canvas 2D context"));
                return;
              }

              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = Array.from(imageData.data); // Convert to array for compatibility

              setCropData((prev) => ({
                ...prev,
                [crop]: { sampleData: data, width: img.width, height: img.height },
              }));
              resolve();
            };

            img.onerror = () => {
              console.error(`Failed to load image for ${crop}`);
              reject(new Error(`Failed to load image for ${crop}`));
            };
          });
        });

        await Promise.all(promises);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error processing images");
      } finally {
        setIsLoading(false);
      }
    };

    loadCropHeatMaps();
  }, [basePath]);

  return { cropData, isLoading, error };
};
