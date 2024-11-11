'use client';

import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import Loading from '@/components/Loading';
import ColorBar from '@/components/ColorBar';
import PlainTable from '@/components/PlainTable';
import dynamic from 'next/dynamic';
import { MajorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';
import { getAvg, getStd } from '@/utils/stats';
import { CategoryProps, CropStats } from '@/types/category';
import { heatColors } from '@/types/colorPalettes';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

interface ScoreComponents {
  histScore?: number;
  futScore?: number;
  consScore?: number;
}

const EstimatedYield = ({ lat, lng, historicData, projectedData, cropHeatMapData, bbox, score, setScore }) => {
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
  const [projectedCrop, setProjectedCrop] = useState<MajorCommodityCrop>('Flaxseed');
  const [curProjectedData, setCurProjectedData] = useState(null);

  // Crop Consistency
  const [heatmapCrop, setHeatmapCrop] = useState<MajorCommodityCrop>('Flaxseed');
  const [curHeatmapData, setCurHeatmapData] = useState<any>(null);

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
      
    const headers = ['Rank','Crop', 'Property Relative to Neighbourhood', 'Property Relative to National'];

    const data = sortedCrops.map((crop, index) => ({
      rank: index+1,
      crop,
      neighbourhoodPerf: `${Math.round(projectedData[crop].avgNePerf)}% \u00B1 ${Math.round(projectedData[crop].stdNePerf)}%`,
      nationalPerf: `${Math.round(projectedData[crop].avgNaPerf)}% \u00B1 ${Math.round(projectedData[crop].stdNaPerf)}%`,
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

    const headers = ['Rank','Crop', 'Average', 'Variation'];
    const data = sortedCrops.map((crop, index) => ({
      rank: index+1,
      crop,
      average: `${Math.round(cropHeatMapData[crop].avg)} \u00B1 ${Math.round(cropHeatMapData[crop].std)}`,
      variation: `${(cropHeatMapData[crop].variation).toFixed(3)}`,
    }));
      
    return (
      <div>
        <div className={`${montserrat.className} mb-4 mx-4`}>
          Average Yield Across Property (Bushels/Acre)
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

  return (
    <div>
      <div className={`${merriweather.className} flex text-accent-dark text-2xl pb-2`}>
        <div className="">Estimated Yield</div>
        {score && (
          <div className=""> - {score}%</div>
        )}
      </div>

      {/* Estimated Historic Yield */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>
          Estimated Historic Yield
        </div>
        {historicData && bbox ? ( 
          <div className="flex">
            <div className="w-[40%] mt-8 p-4">
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
                <div className="">Average Yield vs Neighbourhood:</div>
                <div className="">{historicData.avgNePerf}%</div>
              </div>
              <div className="flex justify-between mb-2 mx-4">
                <div className="">Average Yield vs National:</div>
                <div className="">{historicData.avgNaPerf}</div>
              </div>
            </div>
            <div className="w-[60%]">
              <div className="flex-row justify-center items-center w-full">
                <div className={`${montserrat.className} w-full text-center`}>Estimated Historic Yield</div>                    
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
                      barmode: 'group',
                      xaxis: {
                        title: 'Year & Crop Grown',
                        tickangle: -45, 
                      },
                      yaxis: {
                        title: 'Yield (Bushels/Acre)',
                      },
                      legend: {
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
        <div className={`${montserrat.className} text-lg `}>
          Estimated Projected Yield
        </div>
        {curProjectedData && bbox ? ( 
          <div className="flex">
            <div className="w-[44%] mt-8 p-4">
              <ProjectionDisplay />
            </div>
            <div className="w-[56%]">
              <div className="flex-row justify-center items-center w-full">
                <div className="flex justify-center items-center">
                  <div className={`${montserrat.className} mr-4`}>Estimated Projected Yield for:</div>                    
                  <Dropdown 
                    options={majorCommodityCrops} 
                    selected={projectedCrop} 
                    onSelect={setProjectedCrop} 
                  />
                </div>
                <div className="">
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
                      xaxis: { title: "Year" },
                      yaxis: { title: "Yield (Bushels/Acre)" },
                      margin: {
                        t: 10,
                        b: 50,
                        l: 50,
                        r: 0
                      },
                      shapes: [
                        {
                          type: "line",
                          x0: 2024,
                          x1: 2024,
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
        <div className={`${montserrat.className} text-lg `}>Yield Consistency Across Property</div>
        {curHeatmapData && bbox ? (
          <div className="flex">
            <div className="w-[40%] mt-8 p-4">
              <CropConsistencyDisplay />
            </div>
            <div className="w-[60%]">
              <div className="flex w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-4`}>Yield Heatmap for:</div>                    
                    <Dropdown options={majorCommodityCrops} selected={heatmapCrop} onSelect={setHeatmapCrop} />
                  </div>
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={curHeatmapData.imageUrl} />
                </div>
                <div className="flex-row ml-2 justify-start items-center mt-16">
                  <div className={`${merriweather.className} text-center`}>
                      Yield
                  </div>
                  <div className="mb-2">(Bushels/Acre)</div>
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
