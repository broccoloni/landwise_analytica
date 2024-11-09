import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Dropdown from '@/components/Dropdown';
import Legend from '@/components/Legend';
import ColorBar from '@/components/ColorBar';
import { Slider } from "@mui/material";
import PlainTable from '@/components/PlainTable';
import WindDirectionDisplay from "@/components/WindDirectionDisplay";
import { rangeColors } from '@/types/colorPalettes';

const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

const Soil = (
  { lat, lng, soilData, bbox, score, setScore }: 
  { lat: number; lng: number; soilData: any,
    bbox: number[]; score: number | null; setScore: React.Dispatch<React.SetStateAction<number | null>>; }) => {

  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Soil
      </div>

      {/* Size & Layout Section */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Classifications</div>
        {soilData ? (
          <div className="flex w-full">
            <div className="w-[40%] mt-8 p-4">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
            </div>
            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="flex-row w-full">
                  {lat && lng && bbox && soilData && (
                    <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={soilData.imageUrl} />
                  )}
                </div>
                <div className="ml-2 mt-2">
                  <Legend legend={soilData.legend} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Soil;