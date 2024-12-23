'use client';

import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import Container from '@/components/Container';
import { useState } from 'react';
import Link from 'next/link';
import { Check, RotateCcw } from 'lucide-react';
import { useReportContext } from '@/contexts/ReportContext';
import { useCartContext } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function GetReport() {
  const router = useRouter();
    
  const [numReports, setNumReports] = useState<number>(1);
  const { address, setAddress, setLatitude, setLongitude, setAddressComponents, setLandGeometry } = useReportContext();
  const { setQuantity, setAutoRedeem } = useCartContext();

  const costOne = 1299.95;
  const costThree = 2999.95;
  const threeCostOne = 3 * costOne;
  const discountPct = Math.floor((1 - costThree / (3 * costOne)) * 100);

  const [dollarsOne, centsOne] = costOne.toFixed(2).split('.');
  const [dollarsThree, centsThree] = costThree.toFixed(2).split('.');

  const reportContext = useReportContext();
  console.log("Get a report context:", reportContext);

    
  const handleBuyOne = async () => {
    setQuantity(1);
    setAutoRedeem(!!address);
    router.push('/checkout');
  };

  const handleBuyThree = async () => {
    setQuantity(3);
    setAutoRedeem(!!address);
    router.push('/checkout');
  };


  const handleClearAddress = () => {
    setAddress(null);
    setLatitude(null);
    setLongitude(null);
    setAddressComponents(null);
    setLandGeometry([]);
  };
    
  return (
    <div className={`${roboto.className} px-10 md:px-20 lg:px-40 py-10 md:py-20`}>
      <div className="text-2xl text-center mb-12">
        Modernize the way you assess farmland with 
        <span className={`${raleway.className} ml-2`}>Landwise Analytica</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:mx-10 lg:mx-36 justify-items-stretch">
        {/* Single Report Container */}
        <div className="flex justify-center items-center min-w-80">
          <Container className="text-black w-full pt-16 bg-light-yellow border border-gray-300 rounded-lg shadow-lg">
            <div className="flex flex-col">
              <div className="font-semibold text-2xl text-center text-dark-blue">Single Report</div>
              {address && (
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
                  For <span className="font-bold">one</span> property
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
        <div className="flex flex-col min-w-80">
          <div className="bg-medium-green w-full rounded-t-lg text-white text-center text-xl flex justify-center items-center h-10">
            Best Deal
          </div>
          <Container className="text-black w-full bg-light-yellow border border-gray-300 rounded-lg shadow-lg pt-6 rounded-t-none">
            <div className="flex flex-col">
              <div className="font-semibold text-2xl text-center text-dark-blue">Three Reports</div>
              {address && (
                <>
                  <div className="text-xs mx-10 mt-4 h-12">
                    <div>{address}</div>
                    <div className="ml-2 h-4">+2 other properties</div>
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
                <div className="line-through">${threeCostOne.toFixed(2)}</div>
              </div>
              <div className="mx-10 my-4">
                <div className="mb-2">
                  For <span className="font-bold">three</span> properties
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
        
      <div className="flex text-lg justify-center">
        <div className="mr-8 my-auto">Quick Links:</div>
        <div className="flex space-x-8 w-96">
          <Link
            href="/redeem-a-report"
            className="my-auto text-black hover:text-medium-brown hover:underline"
          >
            Redeem a Report
          </Link>
          <Link
            href="/view-an-existing-report"
            className="my-auto text-black hover:text-medium-brown hover:underline"
          >
            View a Redeemed Report
          </Link>            
        </div> 
      </div>
    </div>
  );
}