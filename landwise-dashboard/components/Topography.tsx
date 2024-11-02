import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import dynamic from 'next/dynamic';
import chroma from 'chroma-js';
import Loading from '@/components/Loading';
import Dropdown from '@/components/Dropdown';
import LandUsageLegend from '@/components/LandUsageLegend';
import ColorBar from '@/components/ColorBar';
import { Slider } from "@mui/material";
import PlainTable from '@/components/PlainTable';
import WindDirectionDisplay from "@/components/WindDirectionDisplay";
import { getAvg, getStd } from '@/utils/stats';
import { getHeatMapUrl } from '@/utils/imageUrl';
import { CategoryProps } from '@/types/category';

const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

const Topography = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields, weatherData, score, setScore }: CategoryProps) => {
  const [landUsageYears, setLandUsageYears] = useState<number[]>([]);
  const [landUsageYear, setLandUsageYear] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [curData, setCurData] = useState<any>(null);
  const [avgArea, setAvgArea] = useState<number | null>(null);
  const [avgUsableLandPct, setAvgUsableLandPct] = useState<number | null>(null);
  const [elevationData, setElevationData] = useState<any>(null);
  const [elevationView, setElevationView] = useState<'Elevation' | 'Slope' | 'Convexity'>('Elevation');
  const [curElevationData, setCurElevationData] = useState<any>(null);
  const [windData, setWindData] = useState<any>(null);
  const [windExposure, setWindExposure] = useState<any>(null);
  const [windExposureType, setWindExposureType] = useState<string>('');
  const [curWindExposure, setCurWindExposure] = useState<any>(null);
  const metersPerPixel = 30;
  const sqMetersPerAcre = 4046.8565;

  useEffect(() => {
    if (rasterDataCache) {
      const years = Object.keys(rasterDataCache).filter(key => key !== 'elevation').map(Number); 
      setLandUsageYears(years);
      if (landUsageYear === null) {
        setLandUsageYear(years[0]);
      }

      const numYears = Object.keys(rasterDataCache).filter(key => key !== 'elevation').length;
      const { totalUsableLandPct, totalArea } = Object.values(rasterDataCache).reduce(
        (acc, yearData: any) => {
          if (yearData.usableLandPct) {
            acc.totalUsableLandPct += yearData.usableLandPct;
            acc.totalArea += yearData.area;
          }
          return acc;
        },
        { totalUsableLandPct: 0, totalArea: 0 }
      );

      setAvgUsableLandPct(totalUsableLandPct / numYears);
      setAvgArea(totalArea / numYears * metersPerPixel * metersPerPixel);

      setElevationData(rasterDataCache.elevation);
      setElevationView('Elevation');
    }
  }, [rasterDataCache]);

  useEffect(() => {
    if (elevationData && elevationView) {
      switch (elevationView) {
        case 'Elevation':
          setCurElevationData({
            imageUrl: elevationData.elevationUrl,
            min: elevationData.minElevation,
            max: elevationData.maxElevation,
          });
          break;

        case 'Slope':
          setCurElevationData({
            imageUrl: elevationData.slopeUrl,
            min: elevationData.minSlope,
            max: elevationData.maxSlope,
          });
          break;

        case 'Convexity':
          setCurElevationData({
            imageUrl: elevationData.convexityUrl,
            min: elevationData.minConvexity,
            max: elevationData.maxConvexity,
          });
          break;

        default:
          break;
      }
    }
  }, [elevationData, elevationView]);

  // Set wind data for calculating wind risk
  useEffect(() => {
    if (weatherData) {
      const sortedYears = Object.keys(weatherData).sort((a, b) => b - a);

      for (const year of sortedYears) {
        const yearData = weatherData[year]?.weatherData;
        if (yearData && yearData.length >= 365) {
          setWindData({
            dir: yearData.map(data => data.winddir),
            speed: yearData.map(data => data.windspeed),
            gust: yearData.map(data => data.windgust)
          });
          break;
        }
      }
    }
  }, [weatherData]);
    
  useEffect(() => {
    const calculateWindExposure = async () => {
      if (windData && elevationData) {
        const { aspect, slope } = elevationData;
          
        const calculateExposure = (aspectAngle, slopeAngle, windDirection, windSpeed) => {
          const angleDiff = Math.abs(aspectAngle - windDirection);
          const angleFactor = Math.cos(angleDiff * (Math.PI / 180));
          return slopeAngle * angleFactor * windSpeed;
        };

        const windSpeedExposure = [];
        const windGustExposure = [];
        let minSpeedExposure = 0;
        let maxSpeedExposure = 0;
        let minGustExposure = 0;
        let maxGustExposure = 0;

        slope.forEach((slopeValue, idx) => {
          if (!slopeValue) {
            windSpeedExposure.push(null);
            windGustExposure.push(null);
          } else {
            const slopeAngle = Math.atan(slopeValue) * (180 / Math.PI) / 90;
            const aspectAngle = aspect[idx];

            const windSpeedExposures = windData.dir.map((windDir, i) =>
              calculateExposure(aspectAngle, slopeAngle, windDir, windData.speed[i])
            );
              
            const avgWindSpeedExposure = getAvg(windSpeedExposures);

            const windGustExposures = windData.dir.map((windDir, i) =>
              calculateExposure(aspectAngle, slopeAngle, windDir, windData.gust[i])
            );
            const avgWindGustExposure = getAvg(windGustExposures);

            windSpeedExposure.push(avgWindSpeedExposure);
            windGustExposure.push(avgWindGustExposure);
              
            minSpeedExposure = Math.min(minSpeedExposure, avgWindSpeedExposure);
            maxSpeedExposure = Math.max(maxSpeedExposure, avgWindSpeedExposure);
            minGustExposure = Math.min(minGustExposure, avgWindGustExposure);
            maxGustExposure = Math.max(maxGustExposure, avgWindGustExposure);
          }
        });

        const avgWindDir = getAvg(windData.dir);
        const stdWindDir = getStd(windData.dir);
        const avgWindSpeed = getAvg(windData.speed);
        const stdWindSpeed = getStd(windData.speed);
        const avgWindGust = getAvg(windData.gust);
        const stdWindGust = getStd(windData.gust);
          
        const speedColorScale = chroma.scale(['blue', 'green', 'yellow', 'brown']).domain([minSpeedExposure, maxSpeedExposure]);
        const windSpeedExposureUrl = await getHeatMapUrl(windSpeedExposure, 
                                                         elevationData.width-2, 
                                                         elevationData.height-2, 
                                                         null, 
                                                         speedColorScale,
                                                         15);
 
        const gustColorScale = chroma.scale(['blue', 'green', 'yellow', 'brown']).domain([minGustExposure, maxGustExposure]);
        const windGustExposureUrl = await getHeatMapUrl(windGustExposure, 
                                                        elevationData.width-2, 
                                                        elevationData.height-2, 
                                                        null, 
                                                        gustColorScale,
                                                        15);
          
        setWindExposure({
          windSpeedExposureUrl,
          windGustExposureUrl,
          avgWindDir,
          stdWindDir,
          avgWindSpeed,
          stdWindSpeed,
          avgWindGust,
          stdWindGust,
          minSpeedExposure,
          maxSpeedExposure,
          minGustExposure,
          maxGustExposure,
          bbox: elevationData.bbox,
        });
        setWindExposureType('Speed');
      }
    };

    calculateWindExposure();
  }, [windData, elevationData]);

  useEffect(() => {
    console.log("Wind Exposure:", windExposure);
    if (windExposureType && windExposure) {
      switch (windExposureType) {
        case 'Speed':
          setCurWindExposure({
            imageUrl: windExposure.windSpeedExposureUrl,
            min: windExposure.minSpeedExposure,
            max: windExposure.maxSpeedExposure,
          });
          break;
    
        case 'Gust':
          setCurWindExposure({
            imageUrl: windExposure.windGustExposureUrl,
            min: windExposure.minGustExposure,
            max: windExposure.maxGustExposure,
          });
          break;
    
        default:
          break;
      }
    }
  }, [windExposureType, windExposure]);
    
    
  useEffect(() => {
    if (landUsageYear !== null && rasterDataCache) {
      const yearData = rasterDataCache[landUsageYear];
      setData(yearData);
    }
  }, [landUsageYear, rasterDataCache]);

  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Topography
      </div>

      {/* Size & Layout Section */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Size & Layout</div>
        {data ? (
          <div className="flex w-full">
            <div className="w-[40%] mt-8 p-4">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable
                headers={['Land Section', '% of Land', 'Area (m²)', 'Area (ac)']}
                data={[
                  { 
                    a: 'Total Property',
                    p: '100', 
                    a1: `${avgArea?.toFixed(2)}`, 
                    a2: `${(avgArea / sqMetersPerAcre).toFixed(2)}`,
                  },
                  { 
                    a: 'Historical Cropland',
                    p: `${(avgUsableLandPct * 100)?.toFixed(2)}`, 
                    a1: `${(avgArea * avgUsableLandPct)?.toFixed(2)}`, 
                    a2: `${(avgArea / sqMetersPerAcre * avgUsableLandPct)?.toFixed(2)}`,
                  },
                  { 
                    a: 'Other',
                    p: `${((1 - avgUsableLandPct) * 100)?.toFixed(2)}`, 
                    a1: `${(avgArea * (1 - avgUsableLandPct))?.toFixed(2)}`, 
                    a2: `${(avgArea / sqMetersPerAcre * (1 - avgUsableLandPct))?.toFixed(2)}`,
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
                        valueLabelDisplay="auto"
                      />
                    </div>
                  </div>
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={data.bbox} imageUrl={data.imageUrl} />
                </div>
                <div className="ml-2 mt-8">
                  <LandUsageLegend legend={data.legend} />
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
        {elevationData && curElevationData ? (
          <div className="flex w-full">
            <div className="w-[40%] p-4 mt-8">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable             
                headers={['Elevation View', 'Average']}
                data={[
                  { view:'Elevation', avg:`${elevationData.avgElevation.toFixed(2)} \u00B1 ${elevationData.stdElevation.toFixed(2)}` },
                  { view:'Slope', avg:`${elevationData.avgSlope.toFixed(5)} \u00B1 ${elevationData.stdSlope.toFixed(5)}` },
                  { view:'Convexity', avg: `${elevationData.avgConvexity.toFixed(5)} \u00B1 ${elevationData.stdConvexity.toFixed(5)}` },
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
                      onSelect={(selected) => setElevationView(selected)} 
                    />
                  </div>
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={elevationData.bbox} imageUrl={curElevationData.imageUrl} />
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
                      heatmapColors={['blue', 'green', 'yellow', 'brown']}
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
        {windExposure && curWindExposure ? (
          <div className="flex w-full">
            <div className="w-[40%] p-4 mt-8">
              <div className={`${montserrat.className} mb-4 mx-4`}>Summary</div>
              <PlainTable             
                headers={['Exposure Type', 'Average']}
                data={[
                  { 
                    type:'Wind Speed', 
                    avg:`${windExposure.avgWindSpeed.toFixed(2)} \u00B1 ${windExposure.stdWindSpeed.toFixed(2)}`,
                  },
                  { 
                    type:'Wind Gust', 
                    avg:`${windExposure.avgWindGust.toFixed(2)} \u00B1 ${windExposure.stdWindGust.toFixed(2)}`,
                  },
                ]}
              />
              <div className="flex-row justify-center mx-4">
                <div className="w-full mb-20">Average Wind Direction (and Standard Deviation):</div>
                {windExposure.avgWindDir && windExposure.stdWindDir && (
                  <div className="h-20">
                    <WindDirectionDisplay 
                      windDirection={windExposure.avgWindDir} 
                      windDirectionStdDev={windExposure.stdWindDir} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="w-[60%] flex-row">
              <div className="flex w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-4`}>Wind Exposure Type:</div>                    
                    <Dropdown 
                      options={['Speed','Gust']} 
                      selected={windExposureType} 
                      onSelect={(selected) => setWindExposureType(selected)} 
                    />
                  </div>
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={windExposure.bbox} imageUrl={curWindExposure.imageUrl} />
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
                      heatmapColors={['blue', 'green', 'yellow', 'brown']}
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
        
      {/* <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Water Pooling Potential</div>
        <p>Based on slope/gradient of land. Could also quantify based on the amount of land with different slopes, e.g., 75% of land has less than a 3% slope.</p>
      </div>

      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg`}>Drainage Systems</div>
        <p>Presence and effectiveness of natural or man-made drainage systems.</p>
      </div> */}
    </div>
  );
};

export default Topography;
