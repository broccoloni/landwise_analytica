import React from 'react';
import { merriweather } from '@/ui/fonts';

const Topography = () => {
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Topography
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Water Pooling Potential</div>
        <p>Based on slope/gradient of land. Could also quantify based on the amount of land with different slopes, e.g., 75% of land has less than a 3% slope.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Percentage of Farmable Land</div>
        <p>Percentage of land suitable for growing crops, based on the percentage of land used to grow major commodity crops historically.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Acreage</div>
        <p>Total acreage of the property.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Wind Exposure</div>
        <p>Impact of wind on crops and soil erosion. Use a local wind map to quantify average wind speeds or directional exposure.</p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold">Drainage Systems</div>
        <p>Presence and effectiveness of natural or man-made drainage systems.</p>
      </div>
    </div>
  );
};

export default Topography;
