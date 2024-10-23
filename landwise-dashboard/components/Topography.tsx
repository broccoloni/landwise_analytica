import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Dropdown from '@/components/Dropdown';
import LandUsageLegend from '@/components/LandUsageLegend';
import { Slider } from "@mui/material";

const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

interface TopographyProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
}

const Topography = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields }: TopographyProps) => {
  const [landUsageYears, setLandUsageYears] = useState<number[]>([]);
  const [landUsageYear, setLandUsageYear] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [avgArea, setAvgArea] = useState<number|null>(null);
  const [avgUsableLandPct, setAvgUsableLandPct] = useState<number|null>(null);
  const metersPerPixel = 30;
  const sqMetersPerAcre = 4046.8565; // Approximate but fairly close

  useEffect(() => {
    if (rasterDataCache) {
      const years = Object.keys(rasterDataCache).map(Number);
      setLandUsageYears(years);
      if (landUsageYear === null) {
        setLandUsageYear(years[0]);
      }

      const numYears = Object.keys(rasterDataCache).length;
      const { totalUsableLandPct, totalArea } = Object.values(rasterDataCache).reduce(
        (acc, yearData: any) => {
          acc.totalUsableLandPct += yearData.usableLandPct || 0;
          acc.totalArea += yearData.area || 0;
          return acc;
        },
        { totalUsableLandPct: 0, totalArea: 0 }
      );

      // Calculate averages
      setAvgUsableLandPct(totalUsableLandPct / numYears);
      setAvgArea(totalArea / numYears * metersPerPixel * metersPerPixel);
      
    }
  }, [rasterDataCache]);

  useEffect(() => {
    if (landUsageYear !== null && rasterDataCache) {
      const yearData = rasterDataCache[landUsageYear];
      setData(yearData);
    }
  }, [landUsageYear, rasterDataCache]);
    
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Topography
      </div>
      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg font-semibold`}>Water Pooling Potential</div>
        <p>Based on slope/gradient of land. Could also quantify based on the amount of land with different slopes, e.g., 75% of land has less than a 3% slope.</p>
      </div>
      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg font-semibold`}>Size & Layout</div>
        {data && data?.bbox && data?.imageUrl && data.legend ? (
          <div className="flex w-full">           
            <div className="w-[40%] mt-16 p-4">
              <div className="flex justify-between mb-2">
                <div className="">Property Size:</div>
                <div className="flex">
                  <div className="mr-2">
                    {avgArea?.toFixed(2)} m&sup2;
                  </div>
                  <div className="">
                    {(avgArea / sqMetersPerAcre).toFixed(2)} ac
                  </div>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Average Cropland Size ({(avgUsableLandPct * 100)?.toFixed(2)}%):</div>
                <div className="flex">
                  <div className="mr-2">
                    {(avgArea * avgUsableLandPct)?.toFixed(2)} m&sup2;
                  </div>
                  <div className="">
                    {(avgArea / sqMetersPerAcre * avgUsableLandPct)?.toFixed(2)} ac
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="flex-row w-full">
                  <div className="flex justify-center h-16">
                    <div className={`${montserrat.className} mr-4`}>
                      Year:
                    </div>
                    <div className="w-56">
                      <Slider
                        value={landUsageYear ?? landUsageYears[0]}
                        onChange={(event, newValue) => setLandUsageYear(newValue as number)}
                        min={Math.min(...landUsageYears)}
                        max={Math.max(...landUsageYears)}
                        step={1}
                        marks={landUsageYears.map((year) => ({
                          value: year,
                          label: (year === Math.min(...landUsageYears) || year === Math.max(...landUsageYears) || year === landUsageYear)
                            ? year.toString()
                            : ''
                        }))}
                        valueLabelDisplay="auto"
                      />
                    </div>
                  </div>
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={data.bbox} imageUrl={data.imageUrl} />
                </div>
                <div className="ml-2 mt-16">
                  <LandUsageLegend legend={data.legend} />                      
                </div>
              </div>
              <div className="w-full p-4">
                
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
        <p>Percentage of land suitable for growing crops, based on the percentage of land used to grow major commodity crops historically.</p>
      </div>
      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg`}>Wind Exposure</div>
        <p>Impact of wind on crops and soil erosion. Use a local wind map to quantify average wind speeds or directional exposure.</p>
      </div>
      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg`}>Drainage Systems</div>
        <p>Presence and effectiveness of natural or man-made drainage systems.</p>
      </div>
    </div>
  );
};

export default Topography;
