import React from 'react';
import { merriweather } from '@/ui/fonts';

const InfrastructureAccessibility = () => {
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Infrastructure & Accessibility
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Proximity to Markets</div>
        <p>Distance to major agricultural markets or commodity processing plants. Distance to nearby cities and amenities.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Road Access</div>
        <p>Quality and availability of roads for transporting goods. Proximity to the highway.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Utilities and Water Access</div>
        <p>Availability of electricity, gas, and reliable water sources. Quantify water quality using pH levels, contaminant presence, or cost of water per acre-foot.</p>
      </div>
    </div>
  );
};

export default InfrastructureAccessibility;