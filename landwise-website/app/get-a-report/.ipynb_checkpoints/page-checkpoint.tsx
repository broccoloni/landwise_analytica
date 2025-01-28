'use client';

import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import Container from '@/components/Container';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, RotateCcw } from 'lucide-react';
import { useReportContext } from '@/contexts/ReportContext';
import { useCartContext } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { ReportSize, reportSizeLabels, reportSizeAcres } from '@/types/reportSizes';
import { toTitleCase } from '@/utils/string';
import InfoButton from '@/components/InfoButton';
import { sqMetersPerAcre, isValidSize } from '@/utils/reports';
import NotificationBanner from '@/components/NotificationBanner';
import Loading from '@/components/Loading';

export default function GetReport() {
  const router = useRouter();
  const { setQuantity, setCouponId, setCustomerId, setSessionId, setSize, size, setPriceId } = useCartContext();
  const { address, clearReportContext, reportSize } = useReportContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSize = params.get('size') as ReportSize;

    if (urlSize) {
      setSize(urlSize);
    }
  }, []);

  const handleSizeChange = (selectedSize: ReportSize) => {
    setSize(selectedSize);
    const params = new URLSearchParams(window.location.search);
    params.set('size', selectedSize || 'medium');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };
    
  const [prices, setPrices] = useState<any[]>([]);
  const [coupon, setCoupon] = useState<any>(null);
    
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

        const twentyOffCoupon = coupons.data.find((coupon: any) => coupon.name === "20% off");
          
        setPrices(prices.data);
        setCoupon(twentyOffCoupon);
          
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

  const [priceOne, setPriceOne] = useState<number | null>(null);
  const [priceThree, setPriceThree] = useState<number | null>(null);
  const [discountPct, setDiscountPct] = useState<number | null>(null);

  const [dollarsOne, centsOne] = priceOne ? priceOne.toFixed(2).split('.') : ['', ''];
  const [dollarsThree, centsThree] = priceThree ? priceThree.toFixed(2).split('.') : ['', ''];

  useEffect(() => {
    if (prices && coupon && size !== 'jumbo') {
      
      const curSize = size || 'medium';
      const curPrice = prices.find((price: any) => price.lookup_key === curSize);
        
      setPriceOne(curPrice.unit_amount / 100);
      setPriceThree(3 * curPrice.unit_amount / 100 * (100 - coupon.percent_off) / 100);
      setDiscountPct(coupon.percent_off);
    }
  },[prices, coupon, size]);


  const [validSize, setValidSize] = useState(true);
  useEffect(() => {
    if (address && size && reportSize) {
      if (!isValidSize(size, reportSize) && validSize) {
        setValidSize(false);
      }
      else if (isValidSize(size, reportSize) && !validSize) {
        setValidSize(true);
      }
    }
  },[address, size, reportSize, validSize]);

    
  const handleBuyOne = async () => {
    const curSize = size || 'medium';
    const curPrice = prices.find((price: any) => price.lookup_key === curSize);
      
    setQuantity(1);
    setCustomerId(null);
    setCouponId(null);
    setSessionId(null);
    setPriceId(curPrice.id);
    router.push('/checkout');
  };

  const handleBuyThree = async () => {
    const curSize = size || 'medium';
    const curPrice = prices.find((price: any) => price.lookup_key === curSize);
      
    setQuantity(3);
    setCouponId(coupon.id || null);
    setCustomerId(null);
    setSessionId(null);
    setPriceId(curPrice.id);
    router.push('/checkout');
  };


  const handleClearAddress = () => {
    clearReportContext();
  };
    
  return (
    <div className={`${roboto.className} px-10 md:px-20 lg:px-40 py-10 md:py-20`}>
      <div className="text-2xl text-center mb-8">
        Modernize the way you assess farmland with 
        <span className={`${raleway.className} ml-2`}>Landwise Analytica</span>
      </div>

      <div className="flex justify-center items-center mb-8">
        <div className="bg-medium-brown text-white px-4 py-2 rounded-l border border-gray-800">Property Size</div>
        <div className="inline-flex rounded-r">
        {reportSizeLabels.map((sizeOption) => (
          <button
            key={sizeOption}
            onClick={() => handleSizeChange(sizeOption)}
            className={`px-4 py-2 opacity-90 hover:opacity-75 hover:bg-medium-brown hover:text-white border-t border-r border-b border-gray-500 ${
              size === sizeOption
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

      {!validSize && (
        <div className="mb-8 max-w-xl mx-auto">
          <NotificationBanner type='info'>
            <div className="">
              If you'd like to redeem your report with <span className="font-bold">{address}</span>,
              you must purchase a report of size <span className="font-bold">{reportSize}</span> or larger.               
            </div>
          </NotificationBanner>
        </div>
      )}

      {size && size === 'jumbo' ? (
        <div className="flex justify-center items-center">
          <Container className="text-black  bg-white border border-gray-300 rounded-lg shadow-lg max-w-sm">
            <div className="font-semibold text-2xl text-center text-dark-blue mb-8">{toTitleCase(size)} Report</div>

            <div className="mb-8">To purchase a <span className="font-bold">{toTitleCase(size)}</span> report, please contact us to request a quote using the button below</div>

            <div className="flex justify-center items-center mb-8">
              <Link
                 href={`/contact`}
                 className="px-4 py-2 bg-medium-brown hover:opacity-75 text-white rounded"
                 target="_blank"
                 rel="noopener noreferrer"
              >
                Request a Quote
              </Link>
            </div>

              
            <div className="mb-4">
              <div className="mb-2">We do this to</div>
              <ul className="list-disc ml-5">
                <li>Ensure the authenticity of {size} report requests</li>
                <li>Verify the intended property boundary</li>
                <li>Prevent processing from interfering with our other operations</li>
              </ul>
            </div>
            <div className="">Thank you for your understanding.</div>
          </Container>
        </div>

      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-stretch">
        {/* Single Report Container */}
        <div className="flex flex-col mx-auto md:mx-0 md:ml-auto ">
          <Container className="text-black w-full pt-16 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex flex-col">
              <div className="font-semibold text-2xl text-center text-dark-blue">Single Report</div>
              {address && validSize &&(
                <>
                  <div className="text-xs mx-10 mt-4 h-12">
                    <div className="mb-4">{address}</div>
                  </div>
                  <button 
                    className="flex justify-center items-center mt-2 text-black text-xs hover:text-medium-brown hover:underline"
                    onClick={handleClearAddress}
                  >
                    <RotateCcw className='h-3 w-3 mr-1' />
                    Clear Address
                  </button>
                </>
              )}
              <div className={`${roboto.className} text-center text-4xl mt-4 mb-8`}>
                ${dollarsOne}
                <span className="text-sm relative bottom-4">{centsOne}</span>
              </div>
              <div className="mx-10 my-4">
                <div className="mb-2">
                  For <span className="font-bold">one {size || 'medium'}-sized</span> property
                  <span className="text-[0.5rem] align-super leading-none mr-1 font-bold">1</span>
                </div>
                <ul className="text-sm list-disc mb-2">
                  <li className="ml-5">Estimated Land Productivity</li>
                  <li className="ml-5">Climate & Heat Units</li>
                  <li className="ml-5">Layout, Elevation & Slope</li>
                  <li className="ml-5">Soil Classification & Contents</li>
                </ul>
              </div>
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleBuyOne}
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75"
                >
                  Buy Now
                </button>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/view-sample-report"
                  className="text-sm text-black hover:text-medium-brown hover:underline"
                >
                  View a Sample Report
                </Link>
              </div>
            </div>
          </Container>
        </div>
     
        {/* Three Reports Container */}
        <div className="flex flex-col mx-auto md:mx-0 md:mr-auto ">
          <div className="bg-medium-green w-full rounded-t-lg text-white text-center text-xl flex justify-center items-center h-10">
            Best Deal
          </div>
          <Container className="text-black w-full bg-white border border-gray-300 rounded-lg shadow-lg pt-6 rounded-t-none">
            <div className="flex flex-col">
              <div className="font-semibold text-2xl text-center text-dark-blue">Three Reports</div>
              {address && validSize && (
                <>
                  <div className="text-xs mx-10 mt-4 h-12">
                    <div>{address}</div>
                    <div className="ml-2 h-4">+2 other {size}-sized properties</div>
                  </div>
                  <button 
                    className="flex justify-center items-center mt-2 text-black text-xs hover:text-medium-brown hover:underline"
                    onClick={handleClearAddress}
                  >
                    <RotateCcw className='h-3 w-3 mr-1' />
                    Clear Address
                  </button>
                </>
              )}
              <div className={`${roboto.className} mt-4 text-center text-4xl`}>
                ${dollarsThree}
                <span className="text-sm relative bottom-4">{centsThree}</span>
              </div>
              <div className="flex h-8 justify-center items-center text-gray-500">
                <div className="mr-2 font-bold">{discountPct}% off</div>
                <div className="line-through">{priceOne ? `$${(3*priceOne).toFixed(2)}` : <Loading className="h-5 w-5" />}</div>
              </div>
              <div className="mx-10 my-4">
                <div className="mb-2">
                  For <span className="font-bold">three {size || 'medium'}-sized</span> properties
                  <span className="text-[0.5rem] align-super leading-none mr-1 font-bold">1</span>
                </div>
                <ul className="text-sm list-disc mb-2">
                  <li className="ml-5">Estimated Land Productivity</li>
                  <li className="ml-5">Climate & Heat Units</li>
                  <li className="ml-5">Layout, Elevation & Slope</li>
                  <li className="ml-5">Soil Classification & Contents</li>
                </ul>
              </div>
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleBuyThree}
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75"
                >
                  Buy Now
                </button>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/view-sample-report"
                  className="text-sm text-black hover:text-medium-brown hover:underline"
                >
                  View a Sample Report
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>
      )}

      <div className="md:mx-10 lg:mx-20 mt-20 hidden sm:block">
        <div className="text-2xl text-dark-blue font-bold text-center mb-8">
          The world's first data-driven land assessment platform
        </div>
        <div className="grid grid-cols-4 lg:grid-cols-4 gap-4 mb-12">
            {/* First row */}
            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Historic crop production
            </div>

            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Historic precipitation, dew point & temperatures
            </div>

            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Property area & layout
            </div>

            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Taxonomy & Texture
            </div>

            {/* Second row */}
            
            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Predicted future crop production
            </div>

            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Historic growing degree days & corn heat units
            </div>

            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Elevation & slope data
            </div>

            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Water, sand, clay & organic carbon content
            </div>
            
            {/* Third row */}
            
            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Crop specific yield consistency
            </div>
    
            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Historic growing seasons
            </div>
    

            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              Historic wind & gust exposure
            </div>
    
            <div className="flex">
              <Check className="w-5 h-5 text-medium-green mr-2 mb-auto flex-shrink-0" />
              pH & bulk density
            </div>
        </div>
      </div>

        
      <div className="text-sm text-gray-600 mb-12 mt-10 sm:mt-20 md:mx-10 lg:mx-36">
        <span className="text-[0.5rem] align-super leading-none mr-1 font-bold">1</span>
        Reports can be redeemed at any time and will be available for 180 days after redemption.
      </div>
        
    </div>
  );
}