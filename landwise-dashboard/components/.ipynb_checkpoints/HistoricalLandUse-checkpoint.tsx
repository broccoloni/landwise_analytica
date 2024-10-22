import { useEffect, useState } from 'react';
import { Slider } from "@mui/material";

export default function HistoricalLandUseMap({ historicalLandUse }: { historicalLandUse: { [year: string]: any } }) {
  const [year, setYear] = useState<number | null>(null);
  const [curData, setCurData] = useState<any>(null);
  const [years, setYears] = useState<number[]>([]);

  // Set the available years based on historicalLandUse data
  useEffect(() => {
    if (historicalLandUse && Object.keys(historicalLandUse).length > 0) {
      const availableYears = Object.keys(historicalLandUse).map(Number); // Convert to number array
      setYears(availableYears);
      setYear(availableYears[availableYears.length - 1]); // Set the last year as the default year
    }
  }, [historicalLandUse]);

  // Update current data when the year changes
  useEffect(() => {
    if (year !== null && historicalLandUse) {
      setCurData(historicalLandUse[year]);
    }
  }, [year, historicalLandUse]);

  return (
    <div>
      <h1>Historical Land Use Map</h1>
      
      <div className="flex justify-center items-left">
        <div className="mr-4">Select The Year</div>
        <div className="w-64">
          <Slider
            value={year || 0}
            onChange={(e, newValue) => setYear(newValue as number)}
            step={1}
            min={Math.min(...years)}
            max={Math.max(...years)}
            marks={years.map(year => ({ value: year, label: year.toString() }))}
            valueLabelDisplay="auto"
            aria-labelledby="year-slider"
          />
        </div>
      </div>

      <div className="mt-4">
        {curData ? (
          <div>
            <h2>Land Use Data for {year}</h2>
            <pre>{JSON.stringify(curData, null, 2)}</pre>
          </div>
        ) : (
          <p>Select a year to view land use data</p>
        )}
      </div>
    </div>
  );
}
