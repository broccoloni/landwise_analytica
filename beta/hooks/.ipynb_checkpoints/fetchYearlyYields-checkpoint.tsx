import { useEffect, useState } from 'react';
import { majorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';
import Papa from "papaparse";

interface CropData {
  Crop: string;
  Year: number;
  Yield: number;
  levels: string;
}

export const fetchYearlyYields = (basePath: string) => {
  const [data, setData] = useState<CropData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${basePath}/demo/yearly_crop_yields.csv`);
      const csv = await response.text();
      const parsed = Papa.parse<CropData>(csv, { header: true, dynamicTyping: true });
      setData(parsed.data);
    };

    fetchData();
  }, []);

  return data;
};