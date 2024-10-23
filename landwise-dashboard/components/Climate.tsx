import React from 'react';
import { merriweather } from '@/ui/fonts';

interface ClimateProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
}

const Climate = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields }: ClimateProps) => {
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Climate
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Rainfall Patterns</div>
        <p>Historical and projected rainfall distribution throughout the year. Quantified using an average mm/year compared to regional norms, plus a "rainfall reliability score" based on consistency.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Temperature Suitability</div>
        <p>Alignment of temperature ranges with crop requirements. Could give a score based on how well the property’s temperature range matches the optimal range for crops that exceed regional levels.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Growing Season Length</div>
        <p>Number of frost-free or warm days suitable for growing crops. Quantifiable as the number of frost-free days compared to specific crop needs.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Climate Resilience</div>
        <p>Climate projections (drought/flood risk in future decades) and proximity to mitigation features like nearby water bodies. Consider climate index scores that aggregate multiple risk factors.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Flood Risk</div>
        <p>Vulnerability of the land to seasonal flooding or waterlogging. Consider using floodplain data, proximity to water bodies, and drainage effectiveness to quantify risk as a percentage or a rating.</p>
      </div>
    </div>
  );
};

export default Climate;
