import { useEffect, useState } from 'react';
import { useFetchDownloadedData } from '@/hooks/useFetchDownloadedData';
import { useFetchCropHeatMaps } from '@/hooks/useFetchCropHeatMaps';
import { useFetchYearlyYields } from '@/hooks/useFetchYearlyYields';

export const useFetchDemoData = (basePath: string) => {
  const [demoData, setDemoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { downloadedData, isLoading: loadingDownloadedData, error: errorDownloadedData } = useFetchDownloadedData(basePath);
  const { cropData: cropHeatMaps, isLoading: loadingCropHeatMaps, error: errorCropHeatMaps } = useFetchCropHeatMaps(basePath);
  const { data: yearlyYields, isLoading: loadingYearlyYields, error: errorYearlyYields } = useFetchYearlyYields(basePath);
    
  useEffect(() => {
    // Set demo data if all data hooks have successfully loaded their data
    const loading = loadingDownloadedData || loadingCropHeatMaps || loadingYearlyYields;
    setIsLoading(loading);

    if (!loading && downloadedData && cropHeatMaps && yearlyYields) {
      setDemoData({ ...downloadedData, cropHeatMaps, yearlyYields });
    }

  }, [downloadedData, cropHeatMaps, yearlyYields, loadingDownloadedData, loadingCropHeatMaps, loadingYearlyYields]);

  useEffect(() => {
    // Check for errors from any of the hooks and set the first error encountered
    if (errorDownloadedData || errorCropHeatMaps || errorYearlyYields) {
      setError(errorDownloadedData || errorCropHeatMaps || errorYearlyYields);
      setIsLoading(false);
    }
  }, [errorDownloadedData, errorCropHeatMaps, errorYearlyYields]);

  return { demoData, isLoading, error };
};
