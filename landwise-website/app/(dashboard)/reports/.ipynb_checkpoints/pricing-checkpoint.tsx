import { ReportSize, reportSizeLabels, reportSizeAcres } from '@/types/reportSizes';
import { useState, useEffect } from 'react';
import { toTitleCase } from '@/utils/string';
import InfoButton from '@/components/InfoButton';
import { raleway, roboto } from '@/ui/fonts';
import { sqMetersPerAcre } from '@/utils/reports';

export default function Pricing() {
  const [prices, setPrices] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any>(null);
  const tiers = [1,4,9,15];
  const couponNames = [null, '10% off', '20% off', '30% off'];

  const [curSize, setCurSize] = useState<ReportSize>('medium');
    
  useEffect(() => {
    const getReportPricesAndCoupons = async () => {
      try {
        const response = await fetch('/api/getReportPricesAndCoupons', {
          method: 'GET',
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch prices');
        }
    
        const { prices, coupons } = await response.json();

        console.log("Fetched Prices:", prices);
        console.log("Fetched Coupons:", coupons);
          
        setPrices(prices.data);
        setCoupons(coupons.data);
          
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error('An unexpected error occurred');
        }
      }
    };

    getReportPricesAndCoupons();
  }, []);  

  const [curPrice, setCurPrice] = useState<any>({});  
  useEffect(() => {
    if (curSize && prices) {
      const curPriceName = curPrice?.lookup_key;
      if (curPriceName !== curSize) {
        const newPrice = prices.find((price) => price.lookup_key === curSize);
        setCurPrice(newPrice);
      }
    }
  },[curSize, curPrice, prices]);
    
  return (
    <div>
      <h2 className="text-2xl mb-4">Report Pricing</h2>
      <p className="mb-2">The more you buy per month, the greater the discount!</p>
      <p>Here's our graduated pricing structure:</p>

      <div className="flex justify-center items-center my-8">
        <div className="bg-medium-brown text-white px-4 py-2 rounded-l border border-gray-800">Property Size</div>
        <div className="inline-flex rounded-r">
        {reportSizeLabels.map((sizeOption) => (
          <button
            key={sizeOption}
            onClick={() => setCurSize(sizeOption)}
            className={`px-4 py-2 opacity-90 hover:opacity-75 hover:bg-medium-brown hover:text-white border-t border-r border-b border-gray-500 ${
              curSize === sizeOption
                ? 'bg-medium-brown text-white'
                : 'bg-white text-gray-800'
            } ${sizeOption !== reportSizeLabels.slice(-1)[0] ? '' : 'rounded-r'}`}
          >
            {toTitleCase(sizeOption)}
          </button>
        ))}
        </div>
        <div className="flex justify-center items-center ml-4 mt-1">
          <InfoButton>
            <div className="">
              <div className={`${raleway.className} text-lg mb-2`}>Property Sizing</div>
              <div className={`${roboto.className} text-sm mb-2`}>
                When redeeming your report, you must define a boundary corresponding to the property. The property boundary you provide must enclose an area less than or equal to the below sizes.
              </div>
              <div>
                {reportSizeLabels.map((sizeLabel, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-700 border-b py-2"
                  >
                    <span className="w-24">
                      {toTitleCase(sizeLabel)}
                    </span>
                    <span className="w-24 text-right">
                      {sizeLabel === 'jumbo' ? 
                        `> ${Math.round(reportSizeAcres.slice(-1)[0] * sqMetersPerAcre)}` : 
                        Math.round(reportSizeAcres[index] * sqMetersPerAcre)} {`m\u00B2`}
                    </span>
                    <span className="w-24 text-right">
                      {sizeLabel === 'jumbo' ? 
                      `> ${Math.round(reportSizeAcres.slice(-1)[0])}` : 
                      Math.round(reportSizeAcres[index])} ac.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </InfoButton>
        </div>
      </div>
        
      <div className="mt-8">
        {tiers.map((tier, index) => {
        const discountPct = couponNames[index]
          ? coupons?.find((coupon: any) => coupon.name === couponNames[index])?.percent_off || 0
          : 0;
    
        const discountedPrice = ((curPrice?.unit_amount / 100) * (100 - discountPct)) / 100;
    
        return (
          <div
            key={index}
            className="flex justify-between text-sm text-gray-700 border-b py-2"
          >
            <span>
              {tier === 1 ? (
                <div className="w-28">First Report</div>
              ) : index === tiers.length - 1 ? (
                <div className="w-28 flex justify-between">
                  <div>Reports</div>
                  <div>{`${tier}+`}</div>
                </div>
              ) : (
                <div className="w-28 flex justify-between">
                  <div>Reports</div>
                  <div className="mr-2">{`${tiers[index - 1] + 1} - ${tier}`}</div>
                </div>
              )}
            </span>
            <span className="w-44 text-right">
              ${discountedPrice.toFixed(2)} per report
            </span>
            <span className="w-48 text-right">
              {discountPct === 0 ? '' : `${discountPct}% off`}
            </span>
          </div>
        );
      })}
      </div>
    </div>
  );
}
