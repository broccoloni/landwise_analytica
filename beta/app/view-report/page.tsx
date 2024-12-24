'use client';

import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { ReportStatus } from '@/types/statuses'; 
import { useReportContext } from '@/contexts/ReportContext';
import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import AddressDisplay from '@/components/AddressDisplay';
import SummaryScore from '@/components/SummaryScore';
import PrintButton from '@/components/PrintButton';
import DownloadPDF from '@/components/DownloadPDF';
import Loading from '@/components/Loading';

// import EstimatedYield from '@/components/tabs/EstimatedYield';
import Climate from '@/components/tabs/Climate';
import Topography from '@/components/tabs/Topography';
import Soil from '@/components/tabs/Soil';

export default function ViewReport() {
  const { 
    reportId, 
    status, setStatus,
    address, setAddress,
    longitude, setLongitude,
    latitude, setLatitude,
    addressComponents, setAddressComponents,
    landGeometry, setLandGeometry,
  } = useReportContext();

  const [error, setError] = useState('');
    
  // Data holders
  const [climateData, setClimateData] = useState(null);
  const [elevationData, setElevationData] = useState(null);
  const [windData, setWindData] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [landUseData, setLandUseData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [bbox, setBbox] = useState<number[] | null>(null);
    
  // Score trackers
  // const [estimatedYieldScore, setEstimatedYieldScore] = useState<number|null>(null);
  const [climateScore, setClimateScore] = useState<number|null>(null);
  const [topographyScore, setTopographyScore] = useState<number|null>(null);
  const [soilScore, setSoilScore] = useState<number|null>(null);

  // For managing report tabs and loading states
  const [loadingData, setLoadingData] = useState(false);
  const [processingData, setProcessingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('Climate');

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/getReportData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId, status, address, addressComponents, landGeometry }),
      });

      const data = await response.json();
      setDataLoaded(true);

      // Report Context Info
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      setAddress(data.address);
      setAddressComponents(data.addressComponents);
      setLandGeometry(data.landGeometry);
      setStatus(data.status);
        
      // Report Data
      setBbox(data.bbox);
      setHeatUnitData(data.heatUnitData);
      setGrowingSeasonData(data.growingSeasonData);
      setClimateData(data.climateData);
      setElevationData(data.elevationData);
      setLandUseData(data.landUseData);
      setWindData(data.windData);
      setSoilData(data.soilData);
      // setHistoricData(demoData.historicData);
      // setProjectedData(demoData.projectedData);
      // setCropHeatMapData(demoData.cropHeatMapData);
        
      console.log('Fetched data:', data);
      setLoadingData(false);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
  };

  useEffect(() => {
    if (reportId && status && !loadingData && !dataLoaded) {
      if (status === ReportStatus.Unredeemed && address && addressComponents && landGeometry.length > 3) {
        fetchData();
      }
      else if (status === ReportStatus.Redeemed) {
        fetchData();
      }
      else {
       setError("Something went wrong");
      } 
    }
  }, [reportId, status, loadingData, dataLoaded, landGeometry, address, addressComponents]);

  const tabs = [
    // 'EstimatedYield',
    'Climate',
    'Topography',
    'Soil',
  ];
    
  const renderActiveComponent = () => {
    switch (activeTab) {
      // case 'EstimatedYield':
      //   return (
      //     <EstimatedYield
      //       lat={latitude}
      //       lng={longitude}
      //       historicData={historicData}
      //       projectedData={projectedData}
      //       cropHeatMapData={cropHeatMapData}
      //       bbox = {bbox}
      //       score={estimatedYieldScore}
      //       setScore={setEstimatedYieldScore}
      //     />
      //   );
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

  const LoadingDisplay = () => {
    if (status === ReportStatus.Redeemed) {
      return (
        <div className="flex-row justify-center items-center">
          <Loading className="h-20 w-20 mb-4" />
          <div className="">Loading Data...</div>
        </div>
      );
    }

    if (status === ReportStatus.Unredeemed) {
      return (
        <div className="flex-row justify-center items-center">
          <Loading className="h-20 w-20 mb-4" />
          <div className="text-center">
            Downloading and processing data. This may take several minutes.
          </div>
        </div>
      );
    }
  };
    
  return (
    <div className={`${roboto.className} text-black px-10 sm:px-20 md:px-40 py-10 sm:py-20`}>
      <div className="relative py-20">
        <div className="flex justify-between mb-4">
          <div className={`${montserrat.className} text-xl flex justify-center items-center space-x-4`}> 
            <div className="">
              Report: {reportId}
            </div>
            <div className="">
              Date: ADD REPORT DATE TO REPORT CONTEXT
            </div>
          </div>
          <div className="space-x-4 flex">
            <DownloadPDF elementId={'report'} filename={`report-${reportId}.pdf`}/>
            <PrintButton />
          </div>
        </div>
        <Container className="" id="report">
          {dataLoaded && !loadingData ? (
            <div>
              <section id="summary">
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
            </div>
          ) : (
            <LoadingDisplay />
          )}
        </Container>
      </div>
    </div>
  );
}