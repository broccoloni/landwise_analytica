import { ReportSize, reportSizeLabels, reportSizeAcres } from '@/types/reportSizes';
import { useState, useEffect } from 'react';
import { toTitleCase } from '@/utils/string';
import InfoButton from '@/components/InfoButton';
import { raleway, roboto } from '@/ui/fonts';
import { sqMetersPerAcre } from '@/utils/reports';
import Link from 'next/link';
import { tiers, couponNames } from '@/utils/pricingTiers';

export default function Pricing() {
  const [prices, setPrices] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any>(null);

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

  return (
    <div>
      <h2 className="text-2xl mb-4">Report Pricing</h2>
      <p className="mb-4 text-lg">The more you buy per month, the greater the discount!</p>
      <p className="mb-4">Here's our graduated pricing structure:</p>
        
      <div className="mb-8 max-w-lg mx-auto">
        {tiers.map((tier, index) => {
        const discountPct = couponNames[index]
          ? coupons?.find((coupon: any) => coupon.name === couponNames[index])?.percent_off || 0
          : 0;
        
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
            <span className="w-48 text-right">
              {discountPct === 0 ? 'Full Price' : `${discountPct}% off`}
            </span>
          </div>
        );
      })}
      </div>

      <div className="mb-4">
        Report base prices are based off of the size of the property
      </div>  

      <div className="border-b flex justify-between text-md py-2">
      <div className="">Property Size</div>
      <div className="text-right">Area {`m\u00B2`}</div>
      <div className="text-right">Area {`ac.`}</div>
      <div className="text-right">Base Price</div>
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
            {sizeLabel === 'jumbo' 
              ? `> ${Math.round(reportSizeAcres.slice(-1)[0] * sqMetersPerAcre)}`
              : Math.round(reportSizeAcres[index] * sqMetersPerAcre)} {`m\u00B2`}
          </span>
          <span className="w-24 text-right">
            {sizeLabel === 'jumbo' 
              ? `> ${Math.round(reportSizeAcres.slice(-1)[0])}`
              : Math.round(reportSizeAcres[index])} ac.
          </span>
          <span className="w-24 text-right">
            {sizeLabel === 'jumbo' ? (
              <Link
                href={'/contact'}
                className="text-medium-green font-bold hover:underline"
              >
                Request a Quote
              </Link>
            ) : prices?.length ? (
              `$${prices.find((price) => price.lookup_key === sizeLabel)?.unit_amount / 100|| ''}`
            ) : (
              'Loading...'
            )}
          </span>
        </div>
      ))}
    </div>

    </div>
  );
}
