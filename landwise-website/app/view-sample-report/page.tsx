'use client';

import { montserrat, roboto, merriweather, raleway } from '@/ui/fonts';
import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import DownloadButton from '@/components/DownloadButton';
import Report from '@/components/Report';
import { useDemoData } from '@/hooks/useDemoData';
import { ImageAndStats, ImageAndLegend, PerformanceData } from '@/types/dataTypes';
import ScrollToTop from '@/components/ScrollToTop';
import processReportData from '@/utils/frontendDataProcessing';
    
export default function SampleReport() {

  // For property selection and definition
  const [reportId, setReportId] = useState('');
  const [status, setStatus] = useState('');
  const [redeemedAt, setRedeemedAt] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
  const [landGeometry, setLandGeometry] = useState<number[][]>([]);
    
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

  // Load demo data
  const { demoData, isLoading, error } = useDemoData();
  useEffect(() => {
    if (!isLoading && demoData) {
      processReportData(demoData);
        
      // Report Attributes
      setReportId(demoData.reportId);
      setLatitude(demoData.latitude);
      setLongitude(demoData.longitude);
      setAddress(demoData.address);
      setAddressComponents(demoData.addressComponents);
      setLandGeometry(demoData.landGeometry);
      setStatus(demoData.status);
      setRedeemedAt(demoData.redeemedAt);
      setCreatedAt(demoData.createdAt);

      // Report Data
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

  return (
    <div className={`${roboto.className} text-black px-10 sm:px-20 md:px-40 py-10`}>
      <div className="relative">
        <div className="flex justify-between mb-4">
          <div className={`${montserrat.className} text-xl flex justify-center items-center space-x-4`}> 
            <div className="">
              Report: {reportId}
            </div>
            <div className="">
              Date: {redeemedAt}
            </div>
          </div>
          <div className="space-x-4 flex">
            <DownloadButton
              reportId = {reportId}
            />
          </div>
        </div>
        <Container className="bg-white">
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
        </Container>
      </div>
      <ScrollToTop />
    </div>
  );
}
