import React from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';

interface EconomicViabilityProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
  weatherData: any;
}

const EconomicViability = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields, weatherData }: EconomicViabilityProps) => {
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Economic Viability
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Property Value Growth</div>
        <p>Historical increase or decrease in land value. Quantified as a percentage increase or decrease over the past 5–10 years based on market data.</p>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Cost of Land Management</div>
        <p>Ongoing costs related to maintaining the land (e.g., fertilization, irrigation). Include typical costs for fertilization, irrigation, pest control, etc.</p>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Commodity Price Volatility</div>
        <p>Risk level based on fluctuations in crop prices. Quantified using historical price fluctuations in key commodities for the region.</p>
      </div>
    </div>
  );
};

export default EconomicViability;
