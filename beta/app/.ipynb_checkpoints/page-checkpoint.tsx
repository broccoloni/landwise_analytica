'use client';

import { montserrat, roboto, merriweather } from '@/ui/fonts';
import Image from 'next/image';
import Link from 'next/link';
import AddressSearch from '@/components/AddressSearch';
import Container from '@/components/Container';
import { useState } from 'react';


export default function Home() {
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
    
  const handleAddressSelect = (address: string, lat: number, lng: number, components: Record<string, string>) => {      
    setSelectedAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    setAddressComponents(components);
  };

    
  return (
    <div className="">
      <div className="px-40 py-20">
        <div className="flex justify-between items-center">
          <div className="w-[50%]">
            <div className="flex-row justify-center items-center">
              <div className={`${roboto.className} font-bold text-center text-[32px] mb-4`}>
                Modernize the way you buy farmland
              </div>
              <div className="flex justify-center mb-12">
                <div className="w-[90%] text-dark-blue">
                  Our reports provide data-driven insights essential for land suitability assessments, all with just a few clicks
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <div className="w-[90%]">
                  <AddressSearch
                    onAddressSelect={handleAddressSelect} 
                    prompt="Search for an address" 
                  />
                </div>
              </div>
              <div className="flex justify-center mb-4">
                Or
              </div>
              <div className="flex justify-center mb-4">
                <div className="bg-medium-brown rounded-lg px-4 py-2 w-[90%] text-center hover:opacity-75">
                  <Link
                    href="get-a-report"
                    className="text-md text-white"
                  >
                    Get a Report
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/view-sample-report"
                  className="text-md text-black hover:text-medium-brown hover:underline"
                >
                  View a Sample Report
                </Link>
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="flex justify-end">
              <Image
                src={'satelliteToHeatmap.png'}
                width={500}
                height={600}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
        
      <div className="px-40 py-20 bg-white">
        <div className="flex-row justify-center">
          <div className="">
            <div className={`${roboto.className} font-bold text-4xl mb-8 text-dark-blue`}>
              Farming is ancient; The way you buy land doesn’t need to be.
            </div>
            <div className="text-xl mb-12">
              Our platform provides you with essential land suitability insights, helping you make better-informed decisions. Here are just a few of the key data points we evaluate:
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="flex justify-center items-center">
              <Container className="text-black transition-transform transform hover:scale-105 duration-200 w-80 h-64 bg-light-yellow border border-gray-300 rounded-lg shadow-lg">
                <div className="font-semibold text-xl mb-2 text-medium-brown">Estimated Yields</div>
                <ul className="list-disc space-y-2 pl-3">
                  <li>Historic crop production</li>
                  <li>Predicted future crop production</li>
                  <li>Crop specific yield consistency</li>
                </ul>
              </Container>
            </div>
        
            <div className="flex justify-center items-center">
              <Container className="text-black transition-transform transform hover:scale-105 duration-200 w-80 h-64 bg-light-yellow border border-gray-300 rounded-lg shadow-lg">
                <div className="font-semibold text-xl mb-2 text-medium-brown">Climate</div>
                <ul className="list-disc space-y-2 pl-3">
                  <li>Historic precipitation, dew point & temperatures</li>
                  <li>Historic growing degree days & corn heat units</li>
                  <li>Historic growing seasons</li>
                </ul>
              </Container>
            </div>
        
            <div className="flex justify-center items-center">
              <Container className="text-black transition-transform transform hover:scale-105 duration-200 w-80 h-64 bg-light-yellow border border-gray-300 rounded-lg shadow-lg">
                <div className="font-semibold text-xl mb-2 text-medium-brown">Topography</div>
                <ul className="list-disc space-y-2 pl-3">
                  <li>Property area & layout</li>
                  <li>Elevation & slope data</li>
                  <li>Historic wind & gust exposure</li>
                </ul>
              </Container>
            </div>

            <div className="flex justify-center items-center">
              <Container className="text-black transition-transform transform hover:scale-105 duration-200 w-80 h-64 bg-light-yellow border border-gray-300 rounded-lg shadow-lg">
                <div className="font-semibold text-xl mb-2 text-medium-brown">Soil</div>
                <ul className="list-disc space-y-2 pl-3">
                  <li>Taxonomy & Texture</li>
                  <li>Water, sand, clay & organic carbon content</li>
                  <li>pH & bulk density</li>
                </ul>
              </Container>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-medium-brown rounded-lg px-4 py-2 w-64 text-center hover:opacity-75">
              <Link
                href="/view-sample-report"
                className="text-md text-white"
              >
                View a Sample Report
              </Link>
            </div>
          </div>       
        </div>
      </div>
    </div>
  );
}