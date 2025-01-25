export default function Pricing() {
  const price = 1299.95;
  const discounts = [0, 15, 25, 35];
  const tier_minimum = [1, 5, 15, 15];

  return (
    <div>
      <h2 className="text-2xl mb-4">Report Pricing</h2>
      <p className="mb-2">The more you buy per month, the greater the discount!</p>
      <p>Here's our graduated pricing structure:</p>
      <div className="mt-8">
        {discounts.map((discountPct, index) => (
          <div
            key={index}
            className="flex justify-between text-sm text-gray-700 border-b py-2"
          >
            <span>
              {tier_minimum[index] === 1 ? (
                <div className="w-28">First Report</div>
              ) : tier_minimum[index] === tier_minimum[index-1] ? (
                <div className="w-28 flex justify-between">
                  <div>Reports</div>
                  <div>{`${tier_minimum[index]}+`}</div>
                </div>
              ) : (
                <div className="w-28 flex justify-between">
                  <div>Reports</div>
                  <div className="mr-2">{`${tier_minimum[index - 1] + 1} - ${tier_minimum[index]}`}</div>
                </div>
              )}
            </span>
            <span className="w-full text-right">${(price * (1 - discountPct / 100)).toFixed(2)} per report</span>
            <span className="w-44 text-right">{discountPct === 0 ? '' : `${discountPct}% off`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
