'use client';

import Container from '@/components/Container';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import dynamic from 'next/dynamic';
import AddressSearch from '@/components/AddressSearch';
import MapDrawing from '@/components/MapDrawing';

// const basePath = '/landwise_analytica';
const basePath = '';

// const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Float32Array | Float64Array;
type LandUsePlanningCrop = "Flaxseed" | "Wheat" | "Barley" | "Oats" | "Canola" | "Peas" | "Corn" | "Soy";

interface ColorBarProps {
  vmin: number;
  vmax: number;
  numIntervals?: number;
}

const DEMO_ADDRESS = {
  address: "8159 Side Road 30, Wellington County, Ontario, N0B 2K0, Canada",
  lat: "43.6929954",
  lng: "-80.3071343",
  components: {
    "street_number": "8159",
    "route": "Side Road 30",
    "locality": "Rockwood",
    "administrative_area_level_3": "Centre Wellington",
    "administrative_area_level_2": "Wellington County",
    "administrative_area_level_1": "ON",
    "country": "CA",
    "postal_code": "N0B 2K0"
  },
};

export default function Search() {
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);

  const handleAddressSelect = (address: string, lat: number, lng: number, components: Record<string, string>) => {
    console.log(components);
      
    setSelectedAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    setAddressComponents(components);
  };

  const handleUseDemoAddress = () => {
    setSelectedAddress(DEMO_ADDRESS.address);
    setLatitude(DEMO_ADDRESS.lat);
    setLongitude(DEMO_ADDRESS.lng);
    setAddressComponents(DEMO_ADDRESS.components);
  };
    

  return (
    <div className={`${roboto.className} bg-accent-light text-black`}>
      <div className="relative m-4">
        <Container className="mb-4">
          <section id="search">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
              Search
            </div>
            <div className="mb-2">
              Search for an address 
            </div>
            <div className = "mb-4">
              <AddressSearch 
                onAddressSelect={handleAddressSelect} 
                prompt="Search for an address" 
              />
            </div>
            <div className="">
              <button
                className="bg-accent-medium rounded-lg px-4 py-2 text-white hover:opacity-75"
                onClick={handleUseDemoAddress}
              >
                Use Demo Address
              </button>
            </div>
          </section>
        </Container>
        {selectedAddress && (
          <>
            <Container className="mb-4">
              <section id="property">
                <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                  Property
                </div>
                <div className="sm:flex flex-row">
                  <div className="w-full">
                    <div className="flex justify-between mb-2">
                      <p className="mr-4">Address:</p>
                      <p>{addressComponents.street_number} {addressComponents.route}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="mr-4">Locality:</p>
                      <p>{addressComponents.locality}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="mr-4">Postal Code:</p>
                      <p>{addressComponents.postal_code}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="mr-4">State:</p>
                      <p>{addressComponents.administrative_area_level_1}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="mr-4">County:</p>
                      <p>{addressComponents.administrative_area_level_2}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="mr-4">Country:</p>
                      <p>{addressComponents.country}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="mr-4">Longitude:</p>
                      <p>{longitude}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="mr-4">Latitude:</p>
                      <p>{latitude}</p>
                    </div>
                  </div>
                  <div className="sm:ml-4 sm:mt-0 mt-4 w-full">
                    <div className='w-full h-full flex justify-center items-center text-center'>
                      Image of address (not implemented yet)
                    </div>
                  </div>
                </div>
              </section>
            </Container>
            <Container>
              <section id="Map">
                <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                  Map
                </div>
                <div className="w-full h-full flex justify-center items-center">
                  <MapDrawing latitude={latitude} longitude={longitude} zoom={15} />
                </div>
              </section>
            </Container>
          </>
        )}
      </div>
    </div>
  );
}
