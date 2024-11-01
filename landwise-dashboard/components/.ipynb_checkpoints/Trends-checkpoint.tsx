'use client';

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { roboto } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// const basePath = '/landwise_analytica';
const basePath = '';

interface CropData {
  Crop: string;
  Year: number;
  Yield: number;
  levels: string;
}

export default function Trends() {
  const [selectedCrop, setSelectedCrop] = useState("Flaxseed");
  const [data, setData] = useState<CropData[]>([]); // Explicitly define the type
  const crops = ["Flaxseed", "Wheat", "Barley", "Oats", "Canola", "Peas", "Corn", "Soy"];

  // Fetch CSV data directly from public folder
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${basePath}/demo/trends/crop_yield_per_year.csv`);
      const csv = await response.text();
      const parsed = Papa.parse<CropData>(csv, { header: true, dynamicTyping: true }); // Specify type here
      setData(parsed.data);
    };

    fetchData();
  }, []);

  // Filter data based on selected crop and years
  const filteredData = data
    .filter((item) => item.Crop === selectedCrop && item.Year >= 2014 && item.Year <= 2034)
    .filter((item) => ["Property", "Neighbourhood", "National"].includes(item.levels));

  // Prepare data for Plotly
  const plotData = filteredData.reduce((acc, item) => {
    const levelIndex = acc.findIndex((series) => series.name === item.levels);
    if (levelIndex !== -1) {
      acc[levelIndex].x.push(item.Year);
      acc[levelIndex].y.push(item.Yield);
    } else {
      acc.push({
        x: [item.Year],
        y: [item.Yield],
        name: item.levels,
        mode: "lines",
      });
    }
    return acc;
  }, [] as { x: number[]; y: number[]; name: string; mode: string }[]); // Define the accumulator type here

  return (
    <div className={`${roboto.className} flex flex-col items-center`}>
      {/* Title and Dropdown Container */}
      <div className="flex items-center">
        <div className={`${roboto.className} mr-2 mb-0`}>
          Estimated Historic & Projected Land Suitability of
        </div>
        <Dropdown options={crops} selected={selectedCrop} onSelect={setSelectedCrop} />
      </div>

      {/* Plot */}
      {plotData.length > 0 ? (
        <Plot
          className="mt-0"
          data={plotData}
          layout={{
            xaxis: { title: "Year" },
            yaxis: { title: "Estimated Land Suitability (Bushels/Acre)" },
            shapes: [
              {
                type: "line",
                x0: 2024,
                x1: 2024,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "grey", dash: "dash" },
              },
            ],
          }}
        />
      ) : (
        <div className="flex justify-center h-full w-full my-20">
          <Loader2 className="h-20 w-20 animate-spin text-black" />
        </div>
      )}
    </div>
  );
}
