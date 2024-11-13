import { useEffect, useState } from 'react';
import { getAvg, getStd, getStats } from '@/utils/stats';
import { DemoData } from '@/types/dataTypes';

export const useFetchDemoData = (basePath: string) => {
  const [demoData, setDemoData] = useState<DemoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${basePath}/demoData.json`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();
        setDemoData(jsonData as DemoData);  
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [basePath]);

  return { demoData, isLoading, error };
};
