import React from 'react';
import { merriweather } from '@/ui/fonts';

const EstimatedYield = () => {
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Estimated Yield
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Estimated Historic Yield</h3>
        <p>Yield of major commodity crops and how it compares to neighborhood and national levels. Consistency of the yield across the property (i.e., are some parts really good and others bad). Does it consistently outperform neighborhood/national levels in the crop being grown?</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Estimated Projected Yield</h3>
        <p>Yield of potential crops and how they compare to neighborhood and national levels. Most suitable crop based on yield compared to neighboring and national levels.</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Crop Diversity Potential</h3>
        <p>The amount of crops that can be grown and exceed the neighboring/national levels.</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Pest and Disease Resistance</h3>
        <p>Historical impact of pests or diseases on crops. Rating based on the average annual yield loss due to pests compared to regional averages.</p>
      </div>
    </div>
  );
};

export default EstimatedYield;
