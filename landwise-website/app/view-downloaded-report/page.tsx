'use client';

import { useState, useRef } from 'react';
import { roboto } from '@/ui/fonts';
import Loading from '@/components/Loading';
import NotificationBanner from '@/components/NotificationBanner';
import { isValidReport } from '@/utils/reports';
import Report from '@/components/Report';
import Container from '@/components/Container';
import { ArrowLeft, RotateCcw, ArrowRight } from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';
import processReportData from '@/utils/frontendDataProcessing';
import { ImageAndStats, ImageAndLegend, PerformanceData } from '@/types/dataTypes';

export default function ViewDownloadedReport() {
  const [validatingReportId, setValidatingReportId] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [viewData, setViewData] = useState(false);

  const [reportId, setReportId] = useState<string>('');
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [addressComponents, setAddressComponents] = useState(null);
  const [landGeometry, setLandGeometry] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const [redeemedAt, setRedeemedAt] = useState(null);

  // States to store different data
  const [historicData, setHistoricData] = useState<PerformanceData | null>(null);
  const [projectedData, setProjectedData] = useState<Record<string, PerformanceData> | null>(null);
  const [cropHeatMapData, setCropHeatMapData] = useState<Record<string, ImageAndStats> | null>(null);
  const [heatUnitData, setHeatUnitData] = useState(null);
  const [growingSeasonData, setGrowingSeasonData] = useState(null);
  const [climateData, setClimateData] = useState<any>(null);
  const [elevationData, setElevationData] = useState<Record<string, ImageAndStats> | null>(null);
  const [windData, setWindData] = useState<Record<string, ImageAndStats> | null>(null);
  const [cropData, setCropData] = useState<any>(null);
  const [landUseData, setLandUseData] = useState<Record<number, ImageAndLegend> | null>(null);
  const [soilData, setSoilData] = useState<any>(null);
  const [bbox, setBbox] = useState<number[][] | null>(null);
  const [allData, setAllData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);  // Reference to the file input

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type === 'application/json') {
        setErrorMessage(null);
        setValidatingReportId(true);

        const reader = new FileReader();

        reader.onload = () => {
          try {
            const parsedData = JSON.parse(reader.result as string);
            console.log("Parsed Downloaded Data", parsedData);
              
            // Perform the validation
            const isValid = isValidReport(parsedData);

            if (!isValid) {
              setValidatingReportId(false);
              setErrorMessage('Invalid file format. Missing or incorrect data.');
              return;
            }

            processReportData(parsedData);
              
            // Set the data to the state variables
            setReportId(parsedData.reportId);
            setLatitude(parsedData.latitude);
            setLongitude(parsedData.longitude);
            setAddress(parsedData.address);
            setAddressComponents(parsedData.addressComponents);
            setLandGeometry(parsedData.landGeometry);
            setStatus(parsedData.status);
            setRedeemedAt(parsedData.redeemedAt);
            setCreatedAt(parsedData.createdAt);
            setBbox(parsedData.bbox);
            setHeatUnitData(parsedData.heatUnitData);
            setGrowingSeasonData(parsedData.growingSeasonData);
            setClimateData(parsedData.climateData);
            setElevationData(parsedData.elevationData);
            setLandUseData(parsedData.landUseData);
            setSoilData(parsedData.soilData);
            setHistoricData(parsedData.historicData);
            setProjectedData(parsedData.projectedData);
            setCropHeatMapData(parsedData.cropHeatMapData);
            setWindData(parsedData.windData);

            setDataLoaded(true);
            setValidatingReportId(false);

          } catch (error) {
            setErrorMessage('Failed to parse the JSON file.');
            console.error('Error parsing JSON:', error);
            setValidatingReportId(false);
          } finally {
            setValidatingReportId(false);
          }
        };

        reader.readAsText(file);
      } else {
        setErrorMessage('Please upload a valid .json file.');
      }
    }
  };

  const handleReset = () => {
    // Clear the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';  // Reset file input
    }

    // Reset all the state variables
    setErrorMessage(null);
    setValidatingReportId(false);
    setDataLoaded(false);
    setViewData(false);
    setReportId('');
    setLatitude(null);
    setLongitude(null);
    setAddress('');
    setAddressComponents(null);
    setLandGeometry([]);
    setStatus('');
    setRedeemedAt(null);
    setCreatedAt(null);
    setBbox(null);
    setHeatUnitData(null);
    setGrowingSeasonData(null);
    setClimateData(null);
    setElevationData(null);
    setWindData(null);
    setCropData(null);
    setLandUseData(null);
    setSoilData(null);
    setHistoricData(null);
    setProjectedData(null);
    setCropHeatMapData(null);
  };

  return (
    <div className={`${roboto.className} min-h-screen px-10 sm:px-20 md:px-40 py-10`}>
      <div className="">
        {viewData && dataLoaded ? (
          <div className="">
            <div className="flex mb-4">
              <button
                className="flex pl-2 pr-4 py-2 rounded bg-medium-brown dark:bg-medium-green text-white hover:opacity-75"
                onClick={handleReset}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                View Another Report
              </button>
            </div>
            <Container className="bg-white dark:bg-dark-gray-c">
              <Report 
                reportId={reportId}
                latitude={latitude} 
                longitude={longitude}
                address={address}
                addressComponents={addressComponents}
                landGeometry={landGeometry}
                status={status}
                redeemedAt={redeemedAt}
                createdAt={createdAt}
                bbox={bbox}
                heatUnitData={heatUnitData}
                growingSeasonData={growingSeasonData}
                climateData={climateData}
                elevationData={elevationData}
                landUseData={landUseData}
                soilData={soilData}
                historicData={historicData}
                projectedData={projectedData}
                cropHeatMapData={cropHeatMapData}
                windData={windData}
              />
            </Container>
            <ScrollToTop />
          </div>
        ) : (
          <div className="pt-10">
            <div className="text-4xl mb-8 text-center">View a Downloaded Report</div>

            <div className="max-w-md mx-auto mb-8">
              <div className="mb-4">Please upload the .json file of the report you downloaded</div>
              <input
                id="report"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                ref={fileInputRef}  // Attach the ref to the file input
              />
            </div>

            <div className="max-w-xl mx-auto">
              {errorMessage && (
                <div className="my-4">
                  <NotificationBanner type="error">
                    {errorMessage}
                  </NotificationBanner>
                </div>
              )}

              {validatingReportId && (
                <div className="my-4">
                  <NotificationBanner type="loading">
                    Validating Report Data...
                  </NotificationBanner>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-2">
              {dataLoaded && (
                <button 
                  className="flex justify-center items-center pl-2 pr-4 py-2 rounded bg-medium-brown dark:bg-medium-green text-white hover:opacity-75"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </button>
              )}
                
              <button 
                className="flex justify-center items-center pl-4 pr-2 py-2 rounded bg-medium-brown dark:bg-medium-green text-white hover:opacity-75"
                onClick={() => setViewData(true)}
                disabled={!dataLoaded}
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
