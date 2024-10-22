import React from 'react';
import { merriweather } from '@/ui/fonts';

const EconomicViability = () => {
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Economic Viability
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Property Value Growth</h3>
        <p>Historical increase or decrease in land value. Quantified as a percentage increase or decrease over the past 5–10 years based on market data.</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Cost of Land Management</h3>
        <p>Ongoing costs related to maintaining the land (e.g., fertilization, irrigation). Include typical costs for fertilization, irrigation, pest control, etc.</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Commodity Price Volatility</h3>
        <p>Risk level based on fluctuations in crop prices. Quantified using historical price fluctuations in key commodities for the region.</p>
      </div>
    </div>
  );
};

export default EconomicViability;
