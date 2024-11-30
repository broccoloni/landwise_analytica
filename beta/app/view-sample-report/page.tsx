'use client';

import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useState, useEffect } from 'react';

import Container from '@/components/Container';
import AddressDisplay from '@/components/AddressDisplay';
import SummaryScore from '@/components/SummaryScore';

// Tabs
import EstimatedYield from '@/components/tabs/EstimatedYield';
import Climate from '@/components/tabs/Climate';
import Topography from '@/components/tabs/Topography';
import Soil from '@/components/tabs/Soil';

import { useFetchDemoData } from '@/hooks/useFetchDemoData';
import { saveData } from '@/utils/save';

import { ImageAndStats, ImageAndLegend, PerformanceData } from '@/types/dataTypes';

// const basePath = '/landwise_analytica';
const basePath = '';

const DEMO_ADDRESS = {
  address: "8159 Side Road 30, Wellington County, Ontario, N0B 2K0, Canada",
  lat: 43.6929954,
  lng: -80.3071343,
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

export default function SampleReport() {
  const isDemoAddress = true;

  // For property selection and definition
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
    
  // Processed Demo Data
  const [historicData, setHistoricData] = useState<PerformanceData|null>(null);
  const [projectedData, setProjectedData] = useState<Record<string, PerformanceData>|null>(null);
  const [cropHeatMapData, setCropHeatMapData] = useState<Record<string, ImageAndStats>|null>(null);
  const [heatUnitData, setHeatUnitData] = useState(null);
  const [growingSeasonData, setGrowingSeasonData] = useState(null);
  const [climateData, setClimateData] = useState<any>(null);
  const [elevationData, setElevationData] = useState<Record<string, ImageAndStats>|null>(null);
  const [windData, setWindData] = useState<Record<string, ImageAndStats>|null>(null);
  const [cropData, setCropData] = useState<any>(null);
  const [landUseData, setLandUseData] = useState<Record<number, ImageAndLegend>|null>(null);
  const [soilData, setSoilData] = useState<any>(null);
  const [bbox, setBbox] = useState<number[][] | null>(null);
    
  // Scores
  const [estimatedYieldScore, setEstimatedYieldScore] = useState<number|null>(null);
  const [climateScore, setClimateScore] = useState<number|null>(null);
  const [topographyScore, setTopographyScore] = useState<number|null>(null);
  const [soilScore, setSoilScore] = useState<number|null>(null);

  // Set demo address on page load 
  useEffect(() => {
    setSelectedAddress(DEMO_ADDRESS.address);
    setLatitude(DEMO_ADDRESS.lat);
    setLongitude(DEMO_ADDRESS.lng);
    setAddressComponents(DEMO_ADDRESS.components);
  }, []);

  // Load demo data
  const { demoData, isLoading, error } = useFetchDemoData(basePath);
  useEffect(() => {
    console.log("Demo data:", demoData);
    if (!isLoading && demoData) {
      // saveData(demoData, 'demoData.json');
      setLatitude(demoData.latitude);
      setLongitude(demoData.longitude);
      setBbox(demoData.bbox);
      setHistoricData(demoData.historicData);
      setProjectedData(demoData.projectedData);
      setCropHeatMapData(demoData.cropHeatMapData);
      setHeatUnitData(demoData.heatUnitData);
      setGrowingSeasonData(demoData.growingSeasonData);
      setClimateData(demoData.climateData);
      setElevationData(demoData.elevationData);
      setLandUseData(demoData.landUseData);
      setWindData(demoData.windData);
      setSoilData(demoData.soilData);
    }
  }, [demoData, isLoading, error]);

  const tabs = [
    'EstimatedYield',
    'Climate',
    'Topography',
    'Soil',
  ];
    
  const [activeTab, setActiveTab] = useState('EstimatedYield');
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'EstimatedYield':
        return (
          <EstimatedYield
            lat={latitude}
            lng={longitude}
            historicData={historicData}
            projectedData={projectedData}
            cropHeatMapData={cropHeatMapData}
            bbox = {bbox}
            score={estimatedYieldScore}
            setScore={setEstimatedYieldScore}
          />
        );
      case 'Climate':
        return (
          <Climate
            lat={latitude}
            lng={longitude}
            heatUnitData={heatUnitData}
            growingSeasonData={growingSeasonData}
            climateData={climateData}
            score={climateScore}
            setScore={setClimateScore}
          />
        );      
      case 'Topography':
        return (
          <Topography
            lat={latitude}
            lng={longitude}
            landUseData = {landUseData}
            elevationData = {elevationData}
            windData = {windData}
            bbox = {bbox}
            score={topographyScore}
            setScore={setTopographyScore}
          />
        );
      case 'Soil':
        return (
          <Soil
            lat={latitude}
            lng={longitude}
            soilData={soilData}
            bbox = {bbox}
            score={soilScore}
            setScore={setSoilScore}
          />
        );
      default:
        return null;
    }
  };
    
  return (
    <div className={`${roboto.className} text-black`}>
      <div className="relative py-8">
        <Container className="">
          <section id="summary">
            <div className={`${montserrat.className} text-medium-brown text-2xl mb-2 w-full text-center`}>
              THIS IS A SAMPLE REPORT!
            </div>
            <div className={`${merriweather.className} text-medium-brown text-3xl pb-2`}>
              Summary
            </div>
            <div className="w-full sm:flex flex-row">
              <div className="w-[44%] p-4 mx-12">
                <div className={`${montserrat.className} flex justify-between mb-2 text-2xl`}>
                  Property
                </div>
                <AddressDisplay 
                  addressComponents={addressComponents} 
                  latitude={latitude} 
                  longitude={longitude} 
                />
              </div>
              <div className="w-[56%] p-4">
                <SummaryScore />
              </div>
            </div>
          </section>
          <div className="flex justify-center space-x-8 border-b border-medium-brown mb-4 mt-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 w-48 rounded-t-lg ${
                  activeTab === tab ? 'bg-medium-brown text-white' : 'bg-white text-black'
                } hover:bg-medium-brown hover:opacity-75 hover:text-white`}
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
