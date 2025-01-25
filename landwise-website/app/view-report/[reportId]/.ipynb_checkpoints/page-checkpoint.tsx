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
import { useParams } from "next/navigation";
import Link from 'next/link';
import { ImageAndStats, ImageAndLegend, PerformanceData } from '@/types/dataTypes';

// import EstimatedYield from '@/components/tabs/EstimatedYield';
import Climate from '@/components/tabs/Climate';
import Topography from '@/components/tabs/Topography';
import Soil from '@/components/tabs/Soil';

export default function ViewReport() {
  const params = useParams();
  const urlReportId = params?.reportId as string;
  const { 
    reportId, setReportId,
    status, setStatus,
    address, setAddress,
    longitude, setLongitude,
    latitude, setLatitude,
    addressComponents, setAddressComponents,
    landGeometry, setLandGeometry,
    createdAt, setCreatedAt,
    redeemedAt, setRedeemedAt,
  } = useReportContext();

  useEffect(() => {
    if (urlReportId !== reportId) {
      setReportId(urlReportId);
    }
  }, [urlReportId, reportId]);

  const [error, setError] = useState('');
    
  // Data holders
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
    
  // Score trackers
  // const [estimatedYieldScore, setEstimatedYieldScore] = useState<number|null>(null);

  const [climateScore, setClimateScore] = useState<number|null>(null);
  const [topographyScore, setTopographyScore] = useState<number|null>(null);
  const [soilScore, setSoilScore] = useState<number|null>(null);

  // For managing report tabs and loading states
  // const [loadingData, setLoadingData] = useState(false);
  // const [processingData, setProcessingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('Climate');

  const fetchData = async () => {
    try {
      const response = await fetch('/api/getReportData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId }),
      });

      const result = await response.json();

      const report = result.report;

      if (report.status !== ReportStatus.Redeemed || !report) {
        setStatus(report.status || ReportStatus.Invalid);
          
        if (!report || 
            report.status === ReportStatus.Invalid || 
            report.status === ReportStatus.Error ||
            report.status === ReportStatus.Unredeemed) {
          setDataLoaded(true);
        }
      }

      else {
        
        console.log('Fetched report:', report);
        
        // Report Context Info
        setLatitude(report.latitude || null);
        setLongitude(report.longitude || null);
        setAddress(report.address || null);
        setAddressComponents(report.addressComponents || null);
        setLandGeometry(report.landGeometry || []);
        setStatus(report.status);
        setRedeemedAt(report.redeemedAt || null);
        
        // Report Data
        setBbox(report.bbox);
        setHeatUnitData(report.heatUnitData);
        setGrowingSeasonData(report.growingSeasonData);
        setClimateData(report.climateData);
        setElevationData(report.elevationData);
        setLandUseData(report.landUseData);
        setWindData(report.windData);
        setSoilData(report.soilData);
        // setHistoricData(report.historicData);
        // setProjectedData(report.projectedData);
        // setCropHeatMapData(report.cropHeatMapData);
        
        setDataLoaded(true);
      }

    } catch (error) {
      setDataLoaded(true);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (reportId && !dataLoaded) {
        fetchData();
      } else {
        clearInterval(intervalId); 
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [reportId, dataLoaded]);

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
        <div className="flex-row justify-center items-center my-10">
          <Loading className="h-20 w-20 mb-4" />
          <div className="text-center">Loading Data...</div>
        </div>
      );
    }

    else if (status === ReportStatus.Invalid) {
      return (
        <div className="flex-row justify-center items-center my-10">
          <div className="text-center">Invalid Report ID</div>
        </div>
      );
    }

    else if (status === ReportStatus.Error) {
      return (
        <div className="flex-row justify-center items-center my-10">
          <div className="text-center">An unexpected error occured.</div>
          <div className="text-center">Please try again to redeem your report, or contact us if you have further issues</div>
        </div>
      );
    }

    else if (status === ReportStatus.Unredeemed) {
      return (
        <div className="flex-row justify-center items-center my-10">
          <div className="text-center">This report hasn't been redeemed yet.</div>
          <div className="text-center">
            You can redeem this report by clicking the button below
          </div>
          <div className="flex justify-center items-center mt-4">
            <Link 
              href = {`/redeem-a-report?reportId=${reportId}`}
              className="bg-medium-brown hover:opacity-75 ml px-4 py-2 text-white rounded"
            >
              Redeem Report
            </Link>
          </div>
        </div>
      );
    }

    else {
      return (
        <div className="flex-row justify-center items-center my-10">
          <Loading className="h-20 w-20 mb-4" />
          <div className="text-center">
            {status || 'Loading Data'}...
          </div>
        </div>
      );
    }
  };
    
  return (
    <div className={`${roboto.className} text-black px-10 sm:px-20 md:px-40 py-10`}>
      <div className="relative">
        <div className="flex justify-between mb-4">
          <div className={`${montserrat.className} text-xl flex justify-center items-center space-x-4`}> 
            <div className="">
              Report: {reportId}
            </div>
            <div className="">
              Date: {redeemedAt ? redeemedAt.slice(0, 10) : ''}
            </div>
          </div>
          <div className="space-x-4 flex">
            <DownloadPDF elementId={'report'} fileName={`report-${reportId}.pdf`}/>
            <PrintButton />
          </div>
        </div>
        <Container className="bg-white">
          {dataLoaded && status === ReportStatus.Redeemed ? (
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