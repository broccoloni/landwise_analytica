'use client';

import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Dropdown from '@/components/Dropdown';
import Legend from '@/components/Legend';
import ColorBar from '@/components/ColorBar';
import { Slider } from "@mui/material";
import PlainTable from '@/components/PlainTable';
import WindDirectionDisplay from "@/components/WindDirectionDisplay";
import { ImageAndLegend, ImageAndStats, PerformanceData} from '@/types/dataTypes';
import { rangeColors } from '@/utils/colorPalettes';
import { sqMetersPerAcre } from '@/utils/reports';

const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

const Topography = (
  { lat, lng, landUseData, elevationData, windData, bbox, score, setScore }: 
  { lat: string|number|null; lng: string|number|null; elevationData: Record<string, ImageAndStats>|null; landUseData: Record<number, ImageAndLegend>|null;
    windData: Record<string, ImageAndStats>|null; bbox: number[][]|null; score: number | null; 
    setScore: React.Dispatch<React.SetStateAction<number | null>>; }) => {

  // Land Use
  const [landUsageYears, setLandUsageYears] = useState<number[]>([]);
  const [landUsageYear, setLandUsageYear] = useState<number | null>(null);
  const [curLandUseData, setCurLandUseData] = useState<ImageAndLegend | null>(null);
  const [avgArea, setAvgArea] = useState<number | null>(null);
  const [avgCropArea, setAvgCropArea] = useState<number | null>(null);

  // Elevation
  const [elevationView, setElevationView] = useState<'Elevation' | 'Slope' | 'Convexity'>('Elevation');
  const [curElevationData, setCurElevationData] = useState<ImageAndStats|null>(null);

  // Wind exposure    
  const [windExposureType, setWindExposureType] = useState<'Wind' | 'Gust'>('Wind');
  const [curWindExposure, setCurWindExposure] = useState<ImageAndStats|null>(null);
  
  // const metersPerPixel = 30; // area is now true area, not pixel count when coming from backend

  useEffect(() => {
    if (landUseData) {
      const years = Object.keys(landUseData).map(Number); 
      setLandUsageYears(years);

      if (!landUsageYear) {
        setLandUsageYear(years[0]);
      }

      // Calculate average useable land % and area throughout historical use
      const numYears = Object.keys(landUseData).length;
      const { totalCropArea, totalArea } = Object.values(landUseData).reduce(
        (acc, yearData: any) => {         
          // Check and add to totalArea if yearData.area is valid
          if (yearData.area !== undefined && yearData.area !== null) {
            acc.totalArea += yearData.area;
          }
    
          // Check and add to totalCropArea if yearData.cropArea is valid
          if (yearData.cropArea !== undefined && yearData.cropArea !== null) {
            acc.totalCropArea += yearData.cropArea;
          }
        
          return acc;
        },
        { totalCropArea: 0, totalArea: 0 }
      );
      
      setAvgCropArea(totalCropArea / numYears);
      setAvgArea(totalArea / numYears);
    }
  }, [landUseData]);

  useEffect(() => {      
    if (landUseData && landUsageYear) {
      setCurLandUseData(landUseData[landUsageYear]);
    }
  }, [landUseData, landUsageYear]);

  useEffect(() => {
    if (elevationData && elevationView) {
      switch (elevationView) {
        case 'Elevation':
          setCurElevationData(elevationData.elevation);
          break;

        case 'Slope':
          setCurElevationData(elevationData.slope);
          break;

        case 'Convexity':
          setCurElevationData(elevationData.convexity);
          break;

        default:
          break;
      }
    }
  }, [elevationData, elevationView]);

  useEffect(() => {
    if (windExposureType && windData) {
      switch (windExposureType) {
        case 'Wind':
          setCurWindExposure(windData.wind);
          break;
    
        case 'Gust':
          setCurWindExposure(windData.gust);
          break;
    
        default:
          break;
      }
    }
  }, [windExposureType, windData]);

  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [innerBgColor, setInnerBgColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#6F4F28');
  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    const isDarkMode = document.documentElement.classList.contains('dark');

    if (isDarkMode) {
      setBgColor(computedStyle.getPropertyValue('--dark-gray-c').trim() || '#2C2C2C');
      setInnerBgColor(computedStyle.getPropertyValue('--dark-gray-d').trim() || '#3A3A3A');
      setTextColor('#FFFFFF');
      setAccentColor(computedStyle.getPropertyValue('--medium-green').trim() || '#7CB342');
    } else {
      setBgColor('#FFFFFF');
      setInnerBgColor('#FFFFFF');
      setTextColor('#000000');
      setAccentColor(computedStyle.getPropertyValue('--medium-brown').trim() || '#6F4F28');
    }
  }, []);
      
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Topography
      </div>

      {/* Size & Layout Section */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Size & Layout</div>
        {landUseData && bbox && curLandUseData? (
          <div className="flex w-full">
            <div className="w-[40%] mt-8 p-4">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable
                headers={['Land Section', '% of Land', 'Area (m\u00B2)', 'Area (ac)']}
                data={[
                  { 
                    a: 'Total Property',
                    p: '100', 
                    a1: `${avgArea?.toFixed(0) ?? ''}`, 
                    a2: `${((avgArea ?? 0) / sqMetersPerAcre).toFixed(2)}`,
                  },
                  { 
                    a: 'Historical Cropland',
                    p: `${((avgCropArea ?? 0) / (avgArea ?? 1) * 100)?.toFixed(2)}`, 
                    a1: `${avgCropArea?.toFixed(0)}`, 
                    a2: `${((avgCropArea ?? 0) / sqMetersPerAcre).toFixed(2)}`,
                  },
                  { 
                    a: 'Other',
                    p: `${(((avgArea ?? 0 ) - (avgCropArea ?? 0)) / (avgArea ?? 1) * 100)?.toFixed(2)}`, 
                    a1: `${((avgArea ?? 0 ) - (avgCropArea ?? 0))?.toFixed(0)}`, 
                    a2: `${(((avgArea ?? 0 ) - (avgCropArea ?? 0)) / sqMetersPerAcre).toFixed(2)}`,
                  },
                ]}
              />
            </div>
            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="flex-row w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-8`}>Year:</div>
                    <div className="w-56">
                      <Slider
                        value={landUsageYear ?? landUsageYears[0]}
                        onChange={(event, newValue) => setLandUsageYear(newValue as number)}
                        min={Math.min(...landUsageYears)}
                        max={Math.max(...landUsageYears)}
                        step={1}
                        marks={landUsageYears.map((year) => ({
                          value: year,
                          label: (year === Math.min(...landUsageYears) || year === Math.max(...landUsageYears) || year === landUsageYear)
                            ? year.toString()
                            : ''
                        }))}
                        sx={{
                          color: accentColor,
                          '& .MuiSlider-markLabel': { color: textColor },
                          '& .MuiSlider-valueLabel': { color: textColor },
                        }}
                        valueLabelDisplay="auto"
                      />
                    </div>
                  </div>
                  {lat && lng && bbox && curLandUseData.imageUrl && (
                    <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={curLandUseData.imageUrl} />
                  )}
                </div>
                <div className="ml-2 mt-8">
                  <Legend legend={curLandUseData.legend} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
        
      {/* Elevation Section */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Elevation</div>
        {elevationData && curElevationData && bbox ? (
          <div className="flex w-full">
            <div className="w-[40%] p-4 mt-8">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable             
                headers={['Elevation View', 'Average']}
                data={[
                  { view:'Elevation', avg:`${elevationData.elevation.avg.toFixed(2)} \u00B1 ${elevationData.elevation.std.toFixed(2)}` },
                  { view:'Slope', avg:`${elevationData.slope.avg.toFixed(5)} \u00B1 ${elevationData.slope.std.toFixed(5)}` },
                  { view:'Convexity', avg: `${elevationData.convexity.avg.toFixed(5)} \u00B1 ${elevationData.convexity.std.toFixed(5)}` },
                ]}
              />
            </div>

            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-4`}>Elevation View:</div>                    
                    <Dropdown 
                      options={['Elevation', 'Slope', 'Convexity']} 
                      selected={elevationView} 
                      onSelect={(selected) => setElevationView(selected as "Elevation" | "Slope" | "Convexity")} 
                    />
                  </div>
                  {lat && lng && bbox && curElevationData.imageUrl && (
                    <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={curElevationData.imageUrl} />
                  )}
                </div>
                <div className="flex-row ml-2 justify-start items-center mt-16">
                  <div className={`${merriweather.className} mb-2 text-center`}>
                      {elevationView}
                  </div>
                  <div className="flex justify-center">
                    <ColorBar
                      vmin={curElevationData.min}
                      vmax={curElevationData.max}
                      numIntervals={5}
                      heatmapColors={rangeColors}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>

      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Wind Exposure</div>
        {windData && curWindExposure && bbox ? (
          <div className="flex w-full">
            <div className="w-[40%] p-4 mt-8">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable             
                headers={['Exposure Type', 'Average']}
                data={[
                  { 
                    type:'Wind Speed', 
                    avg:`${(windData?.wind?.avg ?? 0).toFixed(2)} \u00B1 ${(windData?.wind?.std ?? 0).toFixed(2)}`,
                  },
                  { 
                    type:'Wind Gust', 
                    avg:`${(windData?.gust?.avg ?? 0).toFixed(2)} \u00B1 ${(windData?.gust?.std ?? 0).toFixed(2)}`,
                  },
                ]}
              />
              <div className="flex-row justify-center mx-4">
                <div className="w-full mb-20">{`Average ${windExposureType} Direction (and Standard Deviation):`}</div>
                <div className="h-20">
                  <WindDirectionDisplay 
                    windDirection={curWindExposure.avgDir} 
                    windDirectionStdDev={curWindExposure.stdDir} 
                  />
                </div>
              </div>
            </div>

            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-4`}>Wind Exposure Type:</div>                    
                    <Dropdown 
                      options={['Wind','Gust']} 
                      selected={windExposureType} 
                      onSelect={(selected) => setWindExposureType(selected as "Wind" | "Gust")} 
                    />
                  </div>
                  {lat && lng && bbox && curWindExposure.imageUrl && (
                    <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={curWindExposure.imageUrl} />
                  )}
                </div>
                <div className="flex-row ml-2 justify-start items-center mt-16">
                  <div className={`${merriweather.className} mb-2 text-center`}>
                    Exposure
                  </div>
                  <div className="flex justify-center">
                    <ColorBar
                      vmin={curWindExposure.min}
                      vmax={curWindExposure.max}
                      numIntervals={5}
                      heatmapColors={rangeColors}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Topography;
