import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Dropdown from '@/components/Dropdown';
import LandUsageLegend from '@/components/LandUsageLegend';
import ColorBar from '@/components/ColorBar';
import { Slider } from "@mui/material";

const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

interface TopographyProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
}

const Topography = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields }: TopographyProps) => {
  const [landUsageYears, setLandUsageYears] = useState<number[]>([]);
  const [landUsageYear, setLandUsageYear] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [avgArea, setAvgArea] = useState<number | null>(null);
  const [avgUsableLandPct, setAvgUsableLandPct] = useState<number | null>(null);
  const [elevationData, setElevationData] = useState<any>(null);
  const [elevationView, setElevationView] = useState<'Elevation' | 'Slope' | 'Convexity'>('Elevation');
  const [curElevationData, setCurElevationData] = useState<any>(null);
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

      {/* Elevation Section */}
      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg font-semibold`}>Elevation</div>
        {elevationData && curElevationData ? (
          <div className="flex w-full">
            <div className="w-[40%] p-4 mt-16">
              <div className="flex justify-between mb-2">
                <div className="">Min Elevation:</div>
                <div>{elevationData.minElevation} m</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Max Elevation:</div>
                <div>{elevationData.maxElevation} m</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Average Elevation:</div>
                <div>{elevationData.avg.toFixed(2)} m</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Standard Deviation:</div>
                <div>{elevationData.std.toFixed(2)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Min Slope:</div>
                <div>{elevationData.minSlope.toFixed(5)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Max Slope:</div>
                <div>{elevationData.maxSlope.toFixed(5)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Min Convexity:</div>
                <div>{elevationData.minConvexity.toFixed(5)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Max Convexity:</div>
                <div>{elevationData.maxConvexity.toFixed(5)}</div>
              </div>

              <div className="mb-4">

              </div>
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
        
      {/* Water Pooling Potential */}
      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg font-semibold`}>Water Pooling Potential</div>
        <p>Based on slope/gradient of land. Could also quantify based on the amount of land with different slopes, e.g., 75% of land has less than a 3% slope.</p>
      </div>

      {/* Size & Layout Section */}
      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg font-semibold`}>Size & Layout</div>
        {data && data?.bbox && data?.imageUrl && data.legend ? (
          <div className="flex w-full">
            <div className="w-[40%] mt-16 p-4">
              <div className="flex justify-between mb-2">
                <div className="">Property Area:</div>
                <div className="flex">
                  <div className="mr-2">{avgArea?.toFixed(2)} m&sup2;</div>
                  <div>{(avgArea / sqMetersPerAcre).toFixed(2)} ac</div>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Historical Cropland Area ({(avgUsableLandPct * 100)?.toFixed(2)}%):</div>
                <div className="flex">
                  <div className="mr-2">{(avgArea * avgUsableLandPct)?.toFixed(2)} m&sup2;</div>
                  <div>{(avgArea / sqMetersPerAcre * avgUsableLandPct)?.toFixed(2)} ac</div>
                </div>
              </div>
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
                <div className="ml-2 mt-16">
                  <LandUsageLegend legend={data.legend} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>

      {/* Additional Sections */}
      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg`}>Wind Exposure</div>
        <p>Impact of wind on crops and soil erosion. Use a local wind map to quantify average wind speeds or directional exposure.</p>
      </div>

      <div className="mb-4 w-full">
        <div className={`${montserrat.className} text-lg`}>Drainage Systems</div>
        <p>Presence and effectiveness of natural or man-made drainage systems.</p>
      </div>
    </div>
  );
};

export default Topography;
