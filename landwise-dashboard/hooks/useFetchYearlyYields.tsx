import { useEffect, useState } from 'react';
import { yearlyYield } from '@/types/category';
import Papa from "papaparse";

export const useFetchYearlyYields = (basePath: string) => {
  const [data, setData] = useState<yearlyYield[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${basePath}/demo/yearly_crop_yields.csv`);
        if (!response.ok) throw new Error('Failed to fetch yearly yields data');

        const csv = await response.text();
        const parsed = Papa.parse<yearlyYield>(csv, { header: true, dynamicTyping: true });
        setData(parsed.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [basePath]);

  return { data, isLoading, error };
};
