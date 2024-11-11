import { useEffect, useState } from 'react';
import { useFetchDownloadedData } from '@/hooks/useFetchDownloadedData';
import { useFetchCropHeatmaps } from '@/hooks/useFetchCropHeatmaps';
import { useFetchYearlyYields } from '@/hooks/useFetchYearlyYields';

export const useFetchDemoData = (basePath: string) => {
  const [demoData, setDemoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { downloadedData, isLoading: loadingDownloadedData, error: errorDownloadedData } = useFetchDownloadedData(basePath);
  const { cropData: cropHeatmaps, isLoading: loadingCropHeatmaps, error: errorCropHeatmaps } = useFetchCropHeatmaps(basePath);
  const { data: yearlyYields, isLoading: loadingYearlyYields, error: errorYearlyYields } = useFetchYearlyYields(basePath);
    
  useEffect(() => {
    // Set demo data if all data hooks have successfully loaded their data
    const loading = loadingDownloadedData || loadingCropHeatmaps || loadingYearlyYields;
    setIsLoading(loading);

    if (!loading && downloadedData && cropHeatmaps && yearlyYields) {
      setDemoData({ ...downloadedData, cropHeatmaps, yearlyYields });
    }

  }, [downloadedData, cropHeatmaps, yearlyYields, loadingDownloadedData, loadingCropHeatmaps, loadingYearlyYields]);

  useEffect(() => {
    // Check for errors from any of the hooks and set the first error encountered
    if (errorDownloadedData || errorCropHeatmaps || errorYearlyYields) {
      setError(errorDownloadedData || errorCropHeatmaps || errorYearlyYields);
      setIsLoading(false);
    }
  }, [errorDownloadedData, errorCropHeatmaps, errorYearlyYields]);

  return { demoData, isLoading, error };
};
