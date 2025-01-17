import InfoButton from '@/components/InfoButton';

interface GraduatedPricingTableProps {
  subscription: any
}

export default function GraduatedPricingTable({ subscription }: LoadingProps) {
  return (
    <>
      <div className="flex justify-between">
        <div className="font-medium text-md text-gray-800">Graduated Pricing:</div>
        
        <InfoButton className="text-gray-800" size={20}>
          <div className="text-center font-medium text-lg mb-2">Graduated Pricing Example</div>
          <div className="text-sm text-gray-700">
            <div className="flex justify-between text-sm text-gray-700 border-b py-2">
              <div className="">Up to 4 reports:</div>
              <div className="">$A per report</div>
            </div>
            <div className="flex justify-between text-sm text-gray-700 border-b py-2">
              <div className="">Up to 9 reports:</div>
              <div className="">$B per report</div>
            </div>
            <div className="flex justify-between text-sm text-gray-700 border-b py-2">
              <div className="">Up to unlimited reports:</div>
              <div className="">$C per report</div>
            </div>
            <p className="mt-6">
              If you generate 11 reports, your estimated bill (pre-tax) would be calculated as:
            </p>
            <div className="mt-2 px-20">
              <div className="text-right">4 reports × $A</div>
              <div className="text-right">5 reports × $B</div>
              <div className="flex justify-between border-b border-black">
                <div className="ml-1">+</div>
                <div>2 reports × $C</div>
              </div>
              <div className="text-right">Total: 4 × $A + 5 × $B + 2 × $C</div>
            </div>
          </div>
        </InfoButton>
      </div>
      <div className="mt-2">
        {subscription?.tiers && subscription.tiers.length > 0 ? (
          subscription.tiers.map((tier, index) => (
            <div
              key={index}
              className="flex justify-between text-sm text-gray-700 border-b py-2"
            >
              <span>
                Up to {tier.up_to ? `${tier.up_to} reports` : 'unlimited reports'}
              </span>
              <span>${(tier.unit_amount / 100).toFixed(2)} per report</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No pricing tiers available.</p>
        )}
      </div>
    </>
  );
}