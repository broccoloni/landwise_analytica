import { useEffect, useState } from 'react';
import { yearlyYield } from '@/types/category';
import Papa from "papaparse";

export const fetchYearlyYields = (basePath: string) => {
  const [data, setData] = useState<yearlyYield[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${basePath}/demo/yearly_crop_yields.csv`);
      const csv = await response.text();
      const parsed = Papa.parse<yearlyYield>(csv, { header: true, dynamicTyping: true });
      setData(parsed.data);
    };

    fetchData();
  }, []);

  return data;
};