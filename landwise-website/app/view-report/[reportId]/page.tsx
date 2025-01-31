'use client';

import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { ReportStatus } from '@/types/statuses'; 
import { useReportContext } from '@/contexts/ReportContext';
import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import PrintButton from '@/components/PrintButton';
import DownloadButton from '@/components/DownloadButton';
import Loading from '@/components/Loading';
import { useParams } from "next/navigation";
import Link from 'next/link';
import Report from '@/components/Report';
import ScrollToTop from '@/components/ScrollToTop';
import processReportData from '@/utils/frontendDataProcessing';
import { ImageAndStats, ImageAndLegend, PerformanceData } from '@/types/dataTypes';

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
    clearReportContext,
  } = useReportContext();

  useEffect(() => {
    if (urlReportId !== reportId) {
      clearReportContext();
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
  const [rawData, setRawData] = useState<any>(null);

  // For managing report tabs and loading states
  // const [loadingData, setLoadingData] = useState(false);
  // const [processingData, setProcessingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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

      if (!report || report.status !== ReportStatus.Redeemed) {          
        if (!report || 
            report.status === ReportStatus.Invalid || 
            report.status === ReportStatus.Error ||
            report.status === ReportStatus.Unredeemed) {
          setDataLoaded(true);
        }
        setStatus(report.status || ReportStatus.Invalid);
      }

      else {

        setRawData(report);
        processReportData(report);

        // Report Context Info
        setLatitude(report.latitude || null);
        setLongitude(report.longitude || null);
        setAddress(report.address || null);
        setAddressComponents(report.addressComponents || null);
        setLandGeometry(report.landGeometry || []);
        setStatus(report.status);
        setRedeemedAt(report.redeemedAt || null);
        setCreatedAt(report.createdAt || null);
        
        // Report Data
        setBbox(report.bbox);
        setHeatUnitData(report.heatUnitData);
        setGrowingSeasonData(report.growingSeasonData);
        setClimateData(report.climateData);
        setElevationData(report.elevationData);
        setLandUseData(report.landUseData);
        setWindData(report.windData);
        setSoilData(report.soilData);
        setHistoricData(report.historicData);
        setProjectedData(report.projectedData);
        setCropHeatMapData(report.cropHeatMapData);
        
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
          <div className="text-center">
            Please try again to redeem your report, or 
            <Link
              href='/contact'
              className="hover:underline text-medium-green"
            >  
              contact us 
            </Link>
            if you have further issues
          </div>
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
              className="bg-medium-brown dark:bg-medium-green hover:opacity-75 ml px-4 py-2 text-white rounded"
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
    <div className={`${roboto.className} text-black dark:text-white px-10 sm:px-20 md:px-40 py-10`}>
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
            <DownloadButton 
              reportId = {reportId}
            />
          </div>
        </div>
        <Container className="bg-white dark:bg-dark-gray-c">
          {dataLoaded && status === ReportStatus.Redeemed ? (
            <Report 
              reportId = {reportId}
              latitude = {latitude} 
              longitude = {longitude}
              address = {address}
              addressComponents = {addressComponents}
              landGeometry = {landGeometry}
              status = {status}
              redeemedAt = {redeemedAt}
              createdAt = {createdAt}
              bbox = {bbox}
              heatUnitData = {heatUnitData}
              growingSeasonData = {growingSeasonData}
              climateData = {climateData}
              elevationData = {elevationData}
              landUseData = {landUseData}
              soilData = {soilData}
              historicData = {historicData}
              projectedData = {projectedData}
              cropHeatMapData = {cropHeatMapData}
              windData = {windData}
            /> 
          ) : (
            <LoadingDisplay />
          )}
        </Container>
      </div>
      <ScrollToTop />
    </div>
  );
}