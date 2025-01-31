import { ImageAndStats, ImageAndLegend, PerformanceData } from '@/types/dataTypes';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useState } from 'react';
import EstimatedYield from '@/components/tabs/EstimatedYield';
import Climate from '@/components/tabs/Climate';
import Topography from '@/components/tabs/Topography';
import Soil from '@/components/tabs/Soil';
import AddressDisplay from '@/components/AddressDisplay';
import SummaryScore from '@/components/SummaryScore';

interface ReportProps {
  reportId: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  address: string | null;
  addressComponents: any; 
  landGeometry: number[][]; 
  status: string | null;
  redeemedAt: string | null;
  createdAt: string | null;
  bbox: number[][] | null; 
  heatUnitData: any; 
  growingSeasonData: any; 
  climateData: any; 
  elevationData: any; 
  landUseData: any; 
  soilData: any; 
  historicData: any; 
  projectedData: any; 
  cropHeatMapData: any;
  windData: any;
}

const Report: React.FC<ReportProps> = ({
  reportId,
  latitude,
  longitude,
  address,
  addressComponents,
  landGeometry,
  status,
  redeemedAt,
  createdAt,
  bbox,
  heatUnitData,
  growingSeasonData,
  climateData,
  elevationData,
  landUseData,
  soilData,
  historicData,
  projectedData,
  cropHeatMapData,
  windData,
}) => {  
    
  const [activeTab, setActiveTab] = useState('Climate');


  // Score trackers - Delete soon
  const [estimatedYieldScore, setEstimatedYieldScore] = useState<number|null>(null);
  const [climateScore, setClimateScore] = useState<number|null>(null);
  const [topographyScore, setTopographyScore] = useState<number|null>(null);
  const [soilScore, setSoilScore] = useState<number|null>(null);
    
  const tabs = [
    'EstimatedYield',
    'Climate',
    'Topography',
    'Soil',
  ];
    
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
    <div>
      <section id="summary">
        <div className={`${merriweather.className} text-medium-brown dark:text-medium-green text-3xl pb-2`}>
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
      <div className="flex justify-center space-x-8 border-b border-medium-brown dark:border-medium-green mb-4 mt-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 w-48 rounded-t-lg ${
              activeTab === tab ? 'bg-medium-brown text-white dark:bg-medium-green' : 'bg-white text-black dark:bg-dark-gray-d dark:text-white dark:border dark:border-dark-gray-b'
            } hover:bg-medium-brown dark:hover:bg-medium-green hover:opacity-75 hover:text-white`}
          >
            {tab.replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>
      <div>{renderActiveComponent()}</div>
    </div>
  );
}

export default Report;

