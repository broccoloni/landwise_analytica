import React from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';

interface InfrastructureAccessibilityProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
  weatherData: any;
}

const InfrastructureAccessibility = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields, weatherData }: InfrastructureAccessibilityProps) => {
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Infrastructure & Accessibility
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Proximity to Markets</div>
        <p>Distance to major agricultural markets or commodity processing plants. Distance to nearby cities and amenities.</p>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Road Access</div>
        <p>Quality and availability of roads for transporting goods. Proximity to the highway.</p>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Utilities and Water Access</div>
        <p>Availability of electricity, gas, and reliable water sources. Quantify water quality using pH levels, contaminant presence, or cost of water per acre-foot.</p>
      </div>
    </div>
  );
};

export default InfrastructureAccessibility;
