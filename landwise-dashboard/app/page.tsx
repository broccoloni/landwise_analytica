'use client';

import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useState, useEffect } from 'react';

import Container from '@/components/Container';
import AddressDisplay from '@/components/AddressDisplay';
import SummaryScore from '@/components/SummaryScore';

import EstimatedYield from '@/components/EstimatedYield';
import Climate from '@/components/Climate';
import InfrastructureAccessibility from '@/components/InfrastructureAccessibility';
import Topography from '@/components/Topography';
import EconomicViability from '@/components/EconomicViability';

import { fetchRasterDataCache } from '@/hooks/fetchRasterDataCache';
import { fetchCropHeatMaps } from '@/hooks/fetchCropHeatMaps';
import { fetchYearlyYields } from '@/hooks/fetchYearlyYields';
import { fetchClimateData } from '@/hooks/fetchClimateData';

import { CropData } from '@/types/category';


// const basePath = '/landwise_analytica';
const basePath = '';

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
  const isDemoAddress = true;
  const address = DEMO_ADDRESS.address;
  const lat = DEMO_ADDRESS.lat;
  const lng = DEMO_ADDRESS.lng;
  const addressComponents = DEMO_ADDRESS.components;

  const [estimatedYieldScore, setEstimatedYieldScore] = useState<number|null>(null);
  const [climateScore, setClimateScore] = useState<number|null>(null);
  const [topographyScore, setTopographyScore] = useState<number|null>(null);

  const [activeTab, setActiveTab] = useState('EstimatedYield');
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'EstimatedYield':
        return (
          <EstimatedYield
            lat={lat}
            lng={lng}
            rasterDataCache={rasterDataCache}
            elevationData={elevationData}
            cropHeatMaps={cropHeatMaps}
            yearlyYields={yearlyYields}
            climateData={climateData}
            score={estimatedYieldScore}
            setScore={setEstimatedYieldScore}
          />
        );
      case 'Climate':
        return (
          <Climate
            lat={lat}
            lng={lng}
            rasterDataCache={rasterDataCache}
            elevationData={elevationData}
            cropHeatMaps={cropHeatMaps}
            yearlyYields={yearlyYields}
            climateData={climateData}
            score={climateScore}
            setScore={setClimateScore}
          />
        );      
      case 'Topography':
        return (
          <Topography
            lat={lat}
            lng={lng}
            rasterDataCache={rasterDataCache}
            elevationData={elevationData}
            cropHeatMaps={cropHeatMaps}
            yearlyYields={yearlyYields}
            climateData={climateData}
            score={topographyScore}
            setScore={setTopographyScore}
          />
        );
      default:
        return null;
    }
  };

  const tabs = [
    'EstimatedYield',
    'Climate',
    'Topography',
  ];
    
  const { rasterDataCache, elevationData } = fetchRasterDataCache(basePath);
  const cropHeatMaps: CropData = fetchCropHeatMaps(basePath);
  const yearlyYields = fetchYearlyYields(basePath);
  const climateData = fetchClimateData(basePath);
    
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
              <div className="w-[44%] p-4 mx-12">
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
          <div className="flex justify-center space-x-8 border-b border-accent-dark mb-4 mt-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 w-48 rounded-t-lg ${
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
