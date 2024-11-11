'use client';

import { useEffect, useState } from 'react';

export const useFetchDownloadedData = (basePath: string) => {
  const [downloadedData, setDownloadedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${basePath}/demo/downloadedData.json`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();
        setDownloadedData(jsonData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [basePath]);

  return { downloadedData, isLoading, error };
};
