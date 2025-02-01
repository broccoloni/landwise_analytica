'use client';

import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import Loading from '@/components/Loading';
import ColorBar from '@/components/ColorBar';
import PlainTable from '@/components/PlainTable';
import dynamic from 'next/dynamic';
import { majorCommodityCrops } from '@/utils/labels';
import { getAvg, getStd } from '@/utils/stats';
import { ImageAndLegend, ImageAndStats, PerformanceData } from '@/types/dataTypes';
import { heatColors } from '@/utils/colorPalettes';
import InfoButton from '@/components/InfoButton';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

interface ScoreComponents {
  histScore?: number;
  futScore?: number;
  consScore?: number;
}

const EstimatedYield = (
  { lat, lng, historicData, projectedData, cropHeatMapData, bbox, score, setScore }:
  { lat: string|number|null; lng: string|number|null; historicData: PerformanceData|null; projectedData: Record<string, PerformanceData>|null;
    cropHeatMapData: Record<string, ImageAndStats>|null; bbox: number[][]|null; score: number | null; 
    setScore: React.Dispatch<React.SetStateAction<number | null>>; }) => {
  const [scoreComponents, setScoreComponents] = useState<ScoreComponents>({});
  useEffect(() => {
    const scoreValues = Object.values(scoreComponents).map(Number);
    if (scoreValues.length === 3) {
      const avgScore = Math.round(getAvg(scoreValues));
      setScore(avgScore);
    }
  }, [scoreComponents]);

    
  // Historic Yield
  
  // Projected Yield
  const [projectedCrop, setProjectedCrop] = useState<string>('Flaxseed');
  const [curProjectedData, setCurProjectedData] = useState<PerformanceData|null>(null);

  // Crop Consistency
  const [heatmapCrop, setHeatmapCrop] = useState<string>('Flaxseed');
  const [curHeatmapData, setCurHeatmapData] = useState<ImageAndStats|null>(null);

  useEffect(() => {
    if (projectedData && projectedCrop) {
      setCurProjectedData(projectedData[projectedCrop]);
    }
  }, [projectedCrop, projectedData]);

  useEffect(() => {
    if (cropHeatMapData && heatmapCrop) {
      setCurHeatmapData(cropHeatMapData[heatmapCrop]);
    }
  }, [heatmapCrop, cropHeatMapData]);
    
  const ProjectionDisplay = () => {
    if (!projectedData) {
      return null;
    }

    const sortedCrops = Object.keys(projectedData).sort((a, b) => {
      return projectedData[b].avgPerf - projectedData[a].avgPerf;
    });
      
    const headers = ['Rank','Crop', 'Avg. Property Yield vs. Neighbourhood (%)', 'Avg. Property Yield vs. National (%)'];

    const data = sortedCrops.map((crop, index) => ({
      rank: index+1,
      crop,
      neighbourhoodPerf: `${Math.round(projectedData[crop].avgNePerf)} \u00B1 ${Math.round(projectedData[crop].stdNePerf)}`,
      nationalPerf: `${Math.round(projectedData[crop].avgNaPerf)} \u00B1 ${Math.round(projectedData[crop].stdNaPerf)}`,
    }));
      
    return (
      <div>
        <div className={`${montserrat.className} mb-4 ml-4`}>
          Average Relative Future Property Yield
        </div>
        <PlainTable headers={headers} data={data} />
      </div>
    );
  };
    
  const CropConsistencyDisplay = () => {
    if (!cropHeatMapData) {
      return null;
    }
      
    const sortedCrops = Object.keys(cropHeatMapData).sort((a, b) => {
      return cropHeatMapData[a].variation - cropHeatMapData[b].variation;
    });

    const headers = ['Rank','Crop', 'Average Yield (Bushels/Acre)', 'Variation (%)'];
    const data = sortedCrops.map((crop, index) => ({
      rank: index+1,
      crop,
      average: `${(cropHeatMapData[crop].avg).toFixed(2)} \u00B1 ${(cropHeatMapData[crop].std).toFixed(2)}`,
      variation: `${(cropHeatMapData[crop].variation * 100).toFixed(2)}`,
    }));
      
    return (
      <div>
        <div className={`${montserrat.className} mb-4 mx-4`}>
          Summary
        </div>
        <div className="mb-4">
          <PlainTable
            headers={headers}
            data={data}
          />
        </div>
      </div>
    );
  };

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

      {/* Estimated Historic Yield */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg flex justify-between`}>
          <div>Estimated Historic Yield</div>
          <InfoButton>
            <div className="text-center text-lg mb-4">
              Estimated Historic Yield
            </div>
            <div className="text-sm">
              This section details the estimated yield of the major commodity crop that was grown on the land. We use our proprietary machine-learning models along with historical soil-climate-landscape variables and Canada's land inventory maps to estimate these values and compare them to neighboring and national levels.
            </div>
          </InfoButton>
        </div>
        {historicData && bbox ? ( 
          <div className="flex-row">
            <div className="w-full my-4">
              <div className={`${montserrat.className} mb-4 mx-4`}>
                Performance Comparison
              </div>
              <div className="flex justify-between mb-2 mx-4">
                <div className="">Predominant Crops Grown:</div>
                <div>
                  {historicData.cropsGrown.join(', ')}
                </div>
              </div>
              <div className="flex justify-between mb-2 mx-4">
                <div className="">Avg. Property Yield vs. Neighbourhood (%):</div>
                <div className="">{`${Math.round(historicData.avgNePerf)} \u00B1 ${Math.round(historicData.stdNePerf)}`}</div>
              </div>
              <div className="flex justify-between mb-2 mx-4">
                <div className="">Avg. Property Yield vs. National (%):</div>
                <div className="">{`${Math.round(historicData.avgNaPerf)} \u00B1 ${Math.round(historicData.stdNaPerf)}`}</div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex-row justify-center items-center w-full">
                <div className={`${montserrat.className} w-full text-center mb-4`}>Estimated Historic Yield</div>                    
                <div className="">
                  <Plot
                    data={[
                      {
                        x: historicData.labels,
                        y: historicData.property,
                        name: 'Property',
                        type: 'bar',
                        marker: { color: '#708090' },
                      },
                      {
                        x: historicData.labels,
                        y: historicData.neighbourhood,
                        name: 'Neighbourhood',
                        type: 'bar',
                        marker: { color: '#8FBC8F' },
                      },
                      {
                        x: historicData.labels,
                        y: historicData.national,
                        name: 'National',
                        type: 'bar',
                        marker: { color: '#B0C4DE' },
                      },
                    ]}
                    layout={{
                      paper_bgcolor: bgColor,
                      plot_bgcolor: innerBgColor,
                      font: { color: textColor },
                      barmode: 'group',
                      xaxis: {
                        title: 'Year & Crop Grown',
                        tickangle: -45, 
                      },
                      yaxis: {
                        title: 'Yield (Bushels/Acre)',
                      },
                      legend: {
                        x: 0.02,
                        y: 0.98,
                        xanchor: 'left',
                        yanchor: 'top',
                        orientation: 'v',
                        bgcolor: 'rgba(255, 255, 255, 0.5)',                          
                        title: { text: 'Administrative Level' },
                      },
                      margin: {
                        t: 0,
                        b: 100,
                        l: 50,
                        r: 0
                      },
                    }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>

      {/* Estimated Projected Yield */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg flex justify-between`}>
          <div>Estimated Projected Yield</div>
          <InfoButton>
            <div className="text-center text-lg mb-4">
              Estimated Projected Yield
            </div>
            <div className="text-sm">
              This section outlines the estimated yield projections of the major commodity crop that could be grown on the land. We use our proprietary machine-learning models along with soil-climate-landscape variables and CMIP6 climate projections to estimate these values.
            </div>
          </InfoButton>
        </div>
        {curProjectedData && bbox ? ( 
          <div className="flex-row">
            <div className="w-full mt-4 mb-4">
              <ProjectionDisplay />
            </div>
            <div className="w-full">
              <div className="flex-row justify-center items-center w-full">
                <div className="flex-row md:flex justify-center items-center space-y-4 mb-4 md:mb-0">
                  <div className={`${montserrat.className} md:mr-4`}>Estimated Projected Yield for:</div>                    
                  <Dropdown 
                    options={majorCommodityCrops} 
                    selected={projectedCrop} 
                    onSelect={(option: string) => setProjectedCrop(option)} 
                  />
                </div>
                <div className="w-full">
                  <Plot
                    style={{ width: '100%', height: '100%' }}
                    className="mt-0"
                    data={[
                      {
                        x: curProjectedData.years,
                        y: curProjectedData.property,
                        mode: 'lines+markers',
                        name: 'Property',
                        line: { color: 'blue' },
                      },
                      {
                        x: curProjectedData.years,
                        y: curProjectedData.neighbourhood,
                        mode: 'lines+markers',
                        name: 'Neighbourhood',
                        line: { color: 'green' },
                      },
                      {
                        x: curProjectedData.years,
                        y: curProjectedData.national,
                        mode: 'lines+markers',
                        name: 'National',
                        line: { color: 'red' },
                      },
                    ]}
                    layout={{
                      paper_bgcolor: bgColor,
                      plot_bgcolor: innerBgColor,
                      font: { color: textColor },
                      xaxis: { title: "Year" },
                      yaxis: { title: "Yield (Bushels/Acre)" },
                      margin: {
                        t: 10,
                        b: 50,
                        l: 50,
                        r: 0
                      },
                      legend: {
                        x: 0.02,
                        y: 0.98,
                        xanchor: 'left',
                        yanchor: 'top',
                        orientation: 'v',
                        bgcolor: 'rgba(255, 255, 255, 0.5)',
                      },
                      shapes: [
                        {
                          type: "line",
                          x0: 2025,
                          x1: 2025,
                          y0: 0,
                          y1: 1,
                          xref: "x",
                          yref: "paper",
                          line: { color: "grey", dash: "dash" },
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg flex justify-between`}>
          <div>Yield Distribution</div>
          <InfoButton>
            <div className="text-center text-lg mb-4">
              Yield Distribution
            </div>
            <div className="text-sm">
              This section details how the estimated yield fluctuates across the land for a variety of major commodity crops. We use our proprietary machine-learning models along with current soil-climate-landscape variables to estimate these values.
            </div>
          </InfoButton>
        </div>
          {curHeatmapData && bbox ? (
          <div className="flex-row">
            <div className="w-full mt-4 mb-4 ">
              <CropConsistencyDisplay />
            </div>
            <div className="w-full">
              <div className="flex-row md:flex w-full">
                <div className="w-full">
                  <div className="flex-row md:flex justify-center items-center space-y-4 min-h-16 mb-4 md:mb-0">
                    <div className={`${montserrat.className} md:mr-4`}>Yield Heatmap for:</div>                    
                    <Dropdown 
                      options={majorCommodityCrops} 
                      selected={heatmapCrop} 
                      onSelect={(option: string) => setHeatmapCrop(option)} 
                    />
                  </div>
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={curHeatmapData.imageUrl} />
                </div>
                <div className="flex-row md:ml-2 justify-start items-center mt-4 md:mt-16">
                  <div className={`${merriweather.className} text-center`}>
                      Yield
                  </div>
                  <div className="mb-2 text-center">(Bushels/Acre)</div>
                  <div className="flex justify-center">
                    <ColorBar
                      vmin={curHeatmapData.min}
                      vmax={curHeatmapData.max}
                      numIntervals={5}
                      heatmapColors={heatColors}
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

export default EstimatedYield;
