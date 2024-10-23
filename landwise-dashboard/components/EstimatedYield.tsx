import React from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface EstimatedYieldProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
}

const EstimatedYield = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields }: EstimatedYieldProps) => {
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Estimated Yield
      </div>
      <div className="mb-4">
        <div className={`${montserrat.className} text-lg font-semibold`}>Estimated Historic Yield</div>
        <p>Yield of major commodity crops and how it compares to neighborhood and national levels. Consistency of the yield across the property (i.e., are some parts really good and others bad). Does it consistently outperform neighborhood/national levels in the crop being grown?</p>
      </div>
      <div className="mb-4">
        <div className={`${montserrat.className} text-lg font-semibold`}>Estimated Projected Yield</div>
        <p>Yield of potential crops and how they compare to neighborhood and national levels. Most suitable crop based on yield compared to neighboring and national levels.</p>
      </div>
      <div className="mb-4">
        <div className={`${montserrat.className} text-lg font-semibold`}>Crop Diversity Potential</div>
        <p>The amount of crops that can be grown and exceed the neighboring/national levels.</p>
      </div>
      <div className="mb-4">
        <div className={`${montserrat.className} text-lg font-semibold`}>Pest and Disease Resistance</div>
        <p>Historical impact of pests or diseases on crops. Rating based on the average annual yield loss due to pests compared to regional averages.
        </p>
      </div>
    
        
    </div>
  );
};

export default EstimatedYield;
