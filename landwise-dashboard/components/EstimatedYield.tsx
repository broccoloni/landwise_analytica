import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';
import { majorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

interface EstimatedYieldProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
  weatherData: any;
}

const EstimatedYield = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields, weatherData }: EstimatedYieldProps) => {
  // Historic Yield
  const [historicFilteredData, setHistoricFilteredData] = useState<any>({});
  const [allHistoricCrops, setAllHistoricCrops] = useState<string[]>([]);
  const [avgPerfVsNeighbourhood, setAvgPerfVsNeighbourhood] = useState<string>('');
  const [avgPerfVsNational, setAvgPerfVsNational] = useState<string>('');

  // Projected Yield
  const [selectedProjectedCrop, setSelectedProjectedCrop] = useState<majorCommodityCrop>('Flaxseed');

  // Crop Consistency
  const [selectedHeatMapCrop, setSelectedHeatMapCrop] = useState<majorCommodityCrop>('Flaxseed');

    
  const [bbox, setBbox] = useState<number[]>([]);

  useEffect(() => {
    if (yearlyYields && rasterDataCache) {
      const years = Object.keys(rasterDataCache)
        .filter((key) => key !== 'elevation')
        .map(Number);

      if (years.length > 0) {
        setBbox(rasterDataCache[years[0]].bbox);
      }
      
      const uniqueCrops = new Set<string>();
      const newHistoricFilteredData: any = {};
      let neighbourhoodRatios: number[] = [];
      let nationalRatios: number[] = [];
        
      for (const yr of years) {
        const crop = rasterDataCache[yr]?.majorCommodityCropsGrown?.[0];
        if (!crop) continue;

        uniqueCrops.add(crop);
          
        const property = yearlyYields.find(
          (item: any) => item.Crop === crop && item.Year === yr && item.levels === 'Property'
        );
        const neighbourhood = yearlyYields.find(
          (item: any) => item.Crop === crop && item.Year === yr && item.levels === 'Neighbourhood'
        );
        const national = yearlyYields.find(
          (item: any) => item.Crop === crop && item.Year === yr && item.levels === 'National'
        );

        const propertyYield = property?.Yield || 0;
        const neighbourhoodYield = neighbourhood?.Yield || 0;
        const nationalYield = national?.Yield || 0;

        // Calculate yearly performance ratios if yields are available
        if (neighbourhoodYield > 0) {
          neighbourhoodRatios.push(propertyYield / neighbourhoodYield);
        }
        if (nationalYield > 0) {
          nationalRatios.push(propertyYield / nationalYield);
        }
          
        newHistoricFilteredData[yr] = {
          label: `${yr} - ${crop}`,
          property: property?.Yield || 0,
          neighbourhood: neighbourhood?.Yield || 0,
          national: national?.Yield || 0,
        };
      }
      // Calculate the average performance ratios
      const avgNeighbourhoodRatio =
        neighbourhoodRatios.reduce((sum, ratio) => sum + ratio, 0) / neighbourhoodRatios.length * 100 || 0;
      const avgNationalRatio =
        nationalRatios.reduce((sum, ratio) => sum + ratio, 0) / nationalRatios.length * 100 || 0;

      setHistoricFilteredData(newHistoricFilteredData);
      setAllHistoricCrops(Array.from(uniqueCrops));
      setAvgPerfVsNeighbourhood(`${avgNeighbourhoodRatio.toFixed(2)} %`);
      setAvgPerfVsNational(`${avgNationalRatio.toFixed(2)} %`);
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

  const [heatMapData, setHeatMapData] = useState<any>(null);
  useEffect(() => {
    if (cropHeatMaps && selectedHeatMapCrop) {
      setHeatMapData(cropHeatMaps[selectedHeatMapCrop]);
    }
  }, [selectedHeatMapCrop,cropHeatMaps]);

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
          <div className="w-[40%] mt-16 p-4">
            <div className="flex justify-between mb-2">
              <div className="">Crops Grown:</div>
              <div>{allHistoricCrops.join(', ')}</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="">Average Yield vs Neighbourhood:</div>
              <div>{avgPerfVsNeighbourhood}</div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="">Average Yield vs National:</div>
              <div>{avgPerfVsNational}</div>
            </div>
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
            Notes about projected yield blah blah blah
          </div>
          <div className="w-[60%]">
            <div className="flex-row justify-center items-center w-full">
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
        <div className={`${montserrat.className} text-lg `}>Yield Consistency Across Property</div>
        <div className="flex">
          <div className="w-[40%] mt-16">
            Stats about crop consistency
          </div>
          <div className="w-[60%]">
            <div className="flex-row justify-center items-center w-full">
              <div className="flex justify-center items-center mb-4">
                <div className={`${montserrat.className} mr-4`}>Yield Heatmap for:</div>                    
                <Dropdown options={majorCommodityCrops} selected={selectedHeatMapCrop} onSelect={setSelectedHeatMapCrop} />
              </div>
              <div className="">
                {bbox && heatMapData && (
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={heatMapData.imageUrl} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Crop Diversity Potential</div>
        <p>The amount of crops that can be grown and exceed the neighboring/national levels.</p>
      </div> */}
      {/* <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Pest and Disease Resistance</div>
        <p>Historical impact of pests or diseases on crops. Rating based on the average annual yield loss due to pests compared to regional averages.
        </p>
      </div> */}
        
    </div>
  );
};

export default EstimatedYield;
