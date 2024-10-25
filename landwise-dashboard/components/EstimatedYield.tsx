import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';
import { majorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const EstimatedYield = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields }: EstimatedYieldProps) => {
  const [historicFilteredData, setHistoricFilteredData] = useState<any>({});
  const [selectedProjectedCrop, setSelectedProjectedCrop] = useState<majorCommodityCrop>('Flaxseed');

  useEffect(() => {
    if (yearlyYields && rasterDataCache) {
      const years = Object.keys(rasterDataCache)
        .filter((key) => key !== 'elevation')
        .map(Number);

      const newHistoricFilteredData: any = {};
      for (const yr of years) {
        const crop = rasterDataCache[yr]?.majorCommodityCropsGrown?.[0];
        if (!crop) continue;

        const property = yearlyYields.find(
          (item: any) => item.Crop === crop && item.Year === yr && item.levels === 'Property'
        );
        const neighbourhood = yearlyYields.find(
          (item: any) => item.Crop === crop && item.Year === yr && item.levels === 'Neighbourhood'
        );
        const national = yearlyYields.find(
          (item: any) => item.Crop === crop && item.Year === yr && item.levels === 'National'
        );

        newHistoricFilteredData[yr] = {
          label: `${yr} - ${crop}`,
          property: property?.Yield || 0,
          neighbourhood: neighbourhood?.Yield || 0,
          national: national?.Yield || 0,
        };
      }
      setHistoricFilteredData(newHistoricFilteredData);
    }
  }, [yearlyYields, rasterDataCache]);

  // Prepare data for the bar plot
  const historicLabels = Object.keys(historicFilteredData).map((yr) => historicFilteredData[yr].label);
  const historicPropertyYields = Object.keys(historicFilteredData).map((yr) => historicFilteredData[yr].property);
  const historicNeighbourhoodYields = Object.keys(historicFilteredData).map((yr) => historicFilteredData[yr].neighbourhood);
  const historicNationalYields = Object.keys(historicFilteredData).map((yr) => historicFilteredData[yr].national);

  const historicPlotData = [
    {
      x: historicLabels,
      y: historicPropertyYields,
      name: 'Property',
      type: 'bar',
      marker: { color: '#708090' },
    },
    {
      x: historicLabels,
      y: historicNeighbourhoodYields,
      name: 'Neighbourhood',
      type: 'bar',
      marker: { color: '#8FBC8F' },
    },
    {
      x: historicLabels,
      y: historicNationalYields,
      name: 'National',
      type: 'bar',
      marker: { color: '#B0C4DE' },
    },
  ];

  const historicLayout = {
    barmode: 'group',
    xaxis: {
      title: 'Year & Crop Grown',
      tickangle: -45, 
      standoff: 40,
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
  };

  const projectedFilteredData = yearlyYields
    .filter((item) => item.Crop === selectedProjectedCrop && item.Year >= 2014 && item.Year <= 2034)
    .filter((item) => ["Property", "Neighbourhood", "National"].includes(item.levels));

  const projectedPlotData = projectedFilteredData.reduce((acc, item) => {
    const levelIndex = acc.findIndex((series) => series.name === item.levels);
    if (levelIndex !== -1) {
      acc[levelIndex].x.push(item.Year);
      acc[levelIndex].y.push(item.Yield);
    } else {
      acc.push({
        x: [item.Year],
        y: [item.Yield],
        name: item.levels,
        mode: "lines",
      });
    }
    return acc;
  }, [] as { x: number[]; y: number[]; name: string; mode: string }[]);

                

  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Estimated Yield
      </div>

      {/* Estimated Historic Yield */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>
          Estimated Historic Yield
        </div>
        <div className="flex">
          <div className="w-[40%] mt-16">
            Notes about the historic yield. blah blah blah.
          </div>
          <div className="w-[60%]">
            <div className="flex-row justify-center items-center w-full">
              <div className={`${montserrat.className} w-full text-center`}>Estimated Historic Yield</div>                    
              <div className="">
                <Plot
                  data={historicPlotData}
                  layout={historicLayout}
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Projected Yield */}
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>
          Estimated Projected Yield
        </div>
        <div className="flex">
          <div className="w-[40%] mt-16">
            Notes about the projected yield. blah blah blah.
          </div>
          <div className="w-[60%]">
            <div className="flex-row justify-center items-center">
              <div className="flex justify-center items-center">
                <div className={`${montserrat.className} mr-4`}>Estimated Projected Yield for:</div>                    
                <Dropdown options={majorCommodityCrops} selected={selectedProjectedCrop} onSelect={setSelectedProjectedCrop} />
              </div>
              <div className="">
                <Plot
                  className="mt-0"
                  data={projectedPlotData}
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
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Crop Diversity Potential</div>
        <p>The amount of crops that can be grown and exceed the neighboring/national levels.</p>
      </div>
      <div className="py-4">
        <div className={`${montserrat.className} text-lg `}>Pest and Disease Resistance</div>
        <p>Historical impact of pests or diseases on crops. Rating based on the average annual yield loss due to pests compared to regional averages.
        </p>
      </div>
        
    </div>
  );
};

export default EstimatedYield;
