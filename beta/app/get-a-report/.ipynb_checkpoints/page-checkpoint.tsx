'use client';

import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import Container from '@/components/Container';
import { useState } from 'react';
import Link from 'next/link';

export default function Terms() {
  const [numReports, setNumReports] = useState<number>(1);

  const costOne = 1299.95;
  const costThree = 2999.95;
  const threeCostOne = 3 * costOne;
  const discountPct = Math.floor((1 - costThree / (3 * costOne)) * 100);

  const [dollarsOne, centsOne] = costOne.toFixed(2).split('.');
  const [dollarsThree, centsThree] = costThree.toFixed(2).split('.');
    
  const handleBuyOne = () => {
    setNumReports(1);
    console.log("Buying 1 report")
  };

  const handleBuyThree = () => {
    setNumReports(3);
    console.log("Buying 3 reports")
  };
    
  return (
    <div className={`${roboto.className} px-40 py-20`}>
      <div className="text-xl text-center mb-8">
        Modernize the way you assess farmland with 
        <span className={`${raleway.className} ml-2`}>Landwise Analytica</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-12 mb-12 mx-36">
        <div className="flex justify-center items-center">
          <Container className="text-black w-full pt-16 bg-light-yellow border border-gray-300 rounded-lg shadow-lg">
            <div className="flex-row">
              <div className="font-semibold text-2xl text-center mb-8 text-dark-blue">Single Report</div>
              <div className={`${roboto.className} text-center text-4xl mb-8`}>
                ${dollarsOne}<span className="text-sm relative bottom-4">{centsOne}</span>
              </div>
              <div className="mx-10 my-4">
                <div className="mb-2">For <span className="font-bold">one</span> property</div>
                <ul className="text-sm list-disc">
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
    
        <div className="flex-row justify-center items-center">
        
          <div className="bg-medium-green w-full rounded-t-lg text-white text-center text-xl flex justify-center items-center h-10">
            Best Deal
          </div>
          <Container className="text-black w-full bg-light-yellow border border-gray-300 rounded-lg shadow-lg pt-6 rounded-t-none">
            <div className="flex-row">
              <div className="font-semibold text-2xl text-center mb-4 text-dark-blue">Three Reports</div>
              <div className={`${roboto.className} text-center text-4xl`}>
                ${dollarsThree}<span className="text-sm relative bottom-4">{centsThree}</span>
              </div>
              <div className={`flex h-8 justify-center items-center text-gray-500`}>
                <div className="mr-2 font-bold">{discountPct}% off</div>
                <div className="line-through">${threeCostOne.toFixed(2)}</div>
              </div>
              <div className="mx-10 my-4">
                <div className="mb-2">For <span className="font-bold">three</span> properties</div>
                <ul className="text-sm list-disc">
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
      <div className="my-20">
        Our reports help blah blah blah
      </div>
      <div className="flex justify-center">
        <div className="text-xl mr-8 my-auto">Already Bought a Report?</div>
        <div className="flex justify-between w-96">
          <Link
            href="/redeem-a-report"
            className="text-lg my-auto text-black hover:text-medium-brown hover:underline"
          >
            Redeem Your Report
          </Link>
          <div className="my-auto mx-4 text-lg"> or </div>
          <Link
            href="/view-an-existing-report"
            className="text-lg my-auto text-black hover:text-medium-brown hover:underline"
          >
            View Your Report
          </Link>            
        </div> 
      </div>
    </div>
  );
}