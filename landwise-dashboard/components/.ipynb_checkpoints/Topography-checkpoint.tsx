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

  useEffect(() => {
    if (rasterDataCache) {
      const years = Object.keys(rasterDataCache).map(Number);
      setLandUsageYears(years);
      if (landUsageYear === null) {
        setLandUsageYear(years[0]);
      }
    }
  }, [rasterDataCache]);

  useEffect(() => {
    if (landUsageYear !== null && rasterDataCache) {
      const yearData = rasterDataCache[landUsageYear];
      setData(yearData);
    }
  }, [landUsageYear, rasterDataCache]);

  useEffect(() => {
    console.log(data);
  }, [data]);
    
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Topography
      </div>
      <div className="mb-4 w-full">
        <div className="text-lg font-semibold">Water Pooling Potential</div>
        <p>Based on slope/gradient of land. Could also quantify based on the amount of land with different slopes, e.g., 75% of land has less than a 3% slope.</p>
      </div>
      <div className="mb-4 w-full">
        <div className="text-lg font-semibold">Percentage of Farmable Land</div>
        {data && data?.bbox && data?.imageUrl && data.legend ? (
          <div className="flex w-full">           
            <div className="w-[40%]">
              This is text
            </div>
            <div className="w-[60%] flex-row">
              <div className="flex justify-center">
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
              <div className="flex w-full">
                <div className="w-full">
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={data.bbox} imageUrl={data.imageUrl} />
                </div>
                <div className="ml-2">
                  <LandUsageLegend legend={data.legend} />                      
                </div>
              </div>
              <div className="">
                Test 1
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
        <p>Percentage of land suitable for growing crops, based on the percentage of land used to grow major commodity crops historically.</p>
      </div>
      <div className="mb-4 w-full">
        <div className="text-lg font-semibold">Acreage</div>
        <p>Total acreage of the property.</p>
      </div>
      <div className="mb-4 w-full">
        <div className="text-lg font-semibold">Wind Exposure</div>
        <p>Impact of wind on crops and soil erosion. Use a local wind map to quantify average wind speeds or directional exposure.</p>
      </div>
      <div className="mb-4 w-full">
        <div className="text-lg font-semibold">Drainage Systems</div>
        <p>Presence and effectiveness of natural or man-made drainage systems.</p>
      </div>
    </div>
  );
};

export default Topography;
