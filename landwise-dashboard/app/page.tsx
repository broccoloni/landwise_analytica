'use client';

import Container from '@/components/Container';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useRouter } from 'next/navigation';
import Trends from '@/components/Trends';
import chroma from 'chroma-js';
import { fromArrayBuffer } from "geotiff";
import { useState, useEffect, useRef, Suspense } from 'react';
import { Slider } from "@mui/material";
import Dropdown from '@/components/Dropdown';
import { MoveRight, ArrowRight, Loader2 } from 'lucide-react';
import NextImage from 'next/image';
import dynamic from 'next/dynamic';

import AddressDisplay from '@/components/AddressDisplay';

import SummaryScore from '@/components/SummaryScore';
import EstimatedYield from '@/components/EstimatedYield';
import Climate from '@/components/Climate';
import InfrastructureAccessibility from '@/components/InfrastructureAccessibility';
import Topography from '@/components/Topography';
import EconomicViability from '@/components/EconomicViability';

import ColorBar from '@/components/ColorBar';

import { fetchRasterDataCache } from '@/hooks/fetchRasterDataCache';
import { fetchCropHeatMaps } from '@/hooks/fetchCropHeatMaps';

// const basePath = '/landwise_analytica';
const basePath = '';

const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Float32Array | Float64Array;

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

export default function Home() {
  const router = useRouter();
  const scaleFactor=10;
  const isDemoAddress = true;
  const address = DEMO_ADDRESS.address;
  const lat = DEMO_ADDRESS.lat;
  const lng = DEMO_ADDRESS.lng;
  const addressComponents = DEMO_ADDRESS.components;

  const [activeTab, setActiveTab] = useState('EstimatedYield');
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'EstimatedYield':
        return <EstimatedYield />;
      case 'Climate':
        return <Climate />;
      case 'InfrastructureAccessibility':
        return <InfrastructureAccessibility />;
      case 'Topography':
        return <Topography />;
      case 'EconomicViability':
        return <EconomicViability />;
      default:
        return null;
    }
  };

  const tabs = [
    'EstimatedYield',
    'Climate',
    'InfrastructureAccessibility',
    'Topography',
    'EconomicViability',
  ];
    
  const rasterDataCache = fetchRasterDataCache(basePath);
  const cropHeatMaps = fetchCropHeatMaps(basePath);

  console.log("rasterDataCache", rasterDataCache);
  console.log("HeatMaps:", cropHeatMaps);
    
  return (
    <div className={`${roboto.className} bg-accent-light text-black`}>
      <div className="relative m-4">
        <Container className="mb-4">
          <section id="summary">
            <div className={`${montserrat.className} text-accent text-2xl mb-2 w-full text-center`}>
              THIS IS A DEMO REPORT!
            </div>
            <div className={`${merriweather.className} text-accent-dark text-3xl pb-2`}>
              Summary
            </div>
            <div className="w-full sm:flex flex-row">
              <div className="w-[44%] p-4">
                <div className={`${montserrat.className} flex justify-between mb-2 text-2xl`}>
                  Property
                </div>
                <AddressDisplay 
                  addressComponents={addressComponents} 
                  latitude={lat} 
                  longitude={lng} 
                />
              </div>
              <div className="w-[56%] p-4">
                <SummaryScore />
              </div>
            </div>
          </section>
          <div className="flex justify-center space-x-4 border-b border-accent-dark mb-4 mt-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-t-lg ${
                  activeTab === tab ? 'bg-accent-dark text-white' : 'text-black'
                } hover:bg-accent-dark hover:opacity-75 hover:text-white`}
              >
                {tab.replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
          <div>{renderActiveComponent()}</div>
        </Container>
      </div>
    </div>
  );
}
