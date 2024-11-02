import React, { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import Loading from '@/components/Loading';
import ColorBar from '@/components/ColorBar';
import PlainTable from '@/components/PlainTable';
import dynamic from 'next/dynamic';
import { majorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';
import { getAvg, getStd } from '@/utils/stats';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const MapImage = dynamic(() => import('@/components/MapImage'), { ssr: false });

interface EstimatedYieldProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
  weatherData: any;
  score: number | null;
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
}

const EstimatedYield = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields, weatherData, score, setScore }: EstimatedYieldProps) => {
  const [scoreComponents, setScoreComponents] = useState<any>({});
  useEffect(() => {
    const scoreValues = Object.values(scoreComponents).map(Number);
    if (scoreValues.length === 3) {
      const avgScore = getAvg(scoreValues).toFixed(0);
      console.log("Estimated Yield Score:", avgScore);
      setScore(avgScore);
    }
  }, [scoreComponents]);

    
  // Historic Yield
  const [historicData, setHistoricData] = useState<any>({});
  const [cropsGrown, setCropsGrown] = useState({});
  const [histPerf, setHistPerf] = useState<any>({});
  
  // Projected Yield
  const [selectedProjectedCrop, setSelectedProjectedCrop] = useState<majorCommodityCrop>('Flaxseed');
  const [futPerf, setFutPerf] = useState<any>({});
  const [bestProjectedCrop, setBestProjectedCrop] = useState<string>(''); 
  const [worstProjectedCrop, setWorstProjectedCrop] = useState<string>(''); 
  const minYear = 2014;
  const maxYear = 2034;

  // Crop Consistency
  const [selectedHeatMapCrop, setSelectedHeatMapCrop] = useState<majorCommodityCrop>('Flaxseed');
    
  const [bbox, setBbox] = useState<number[]>([]);

  // Process raster data cache
  useEffect(() => {
    if (rasterDataCache) {
      const years = Object.keys(rasterDataCache)
        .filter((key) => key !== 'elevation')
        .map(Number);

      if (years.length > 0) {
        setBbox(rasterDataCache[years[0]].bbox);
      }
      
      const allCropsGrown: any = {};
        
      for (const yr of years) {
        const crop = rasterDataCache[yr]?.majorCommodityCropsGrown?.[0];
        if (!crop) continue;

        allCropsGrown[yr] = crop;
      }
      setCropsGrown(allCropsGrown);
    }
  }, [rasterDataCache]);

  // Process Yearly Yields
  useEffect(() => {
    if (yearlyYields && cropsGrown) {
      const newHistoricData: any = {};
      const histNeighbourhoodPerfs = [];
      const histNationalPerfs = []
      const futNeighbourhoodPerfs = {};
      const futNationalPerfs = {};
      
      const historicYears = Object.keys(cropsGrown).map(Number);    
      const years = [...new Set(yearlyYields.map((item: any) => Number(item.Year)).filter(year => year >= minYear && year <= maxYear))];
      for (const yr of years) {
        for (const crop of majorCommodityCrops) {
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
            
          var neighbourhoodPerf = 0;
          var nationalPerf = 0;

          if (neighbourhoodYield > 0) {
            neighbourhoodPerf = propertyYield / neighbourhoodYield;
          }
          if (nationalYield > 0) {
            nationalPerf = propertyYield / nationalYield;
          }
            
          if (historicYears.includes(yr)) {
            if (crop === cropsGrown[yr]) {
              histNeighbourhoodPerfs.push(neighbourhoodPerf);
              histNationalPerfs.push(nationalPerf);
              newHistoricData[yr] = {
                label: `${yr} - ${crop}`,
                property: propertyYield,
                neighbourhood: neighbourhoodYield,
                national: nationalYield,
              };
            }
          } else {
            if (!(crop in futNeighbourhoodPerfs)) {
              futNeighbourhoodPerfs[crop] = [];
            }
            if (!(crop in futNationalPerfs)) {
              futNationalPerfs[crop] = [];
            }
            futNeighbourhoodPerfs[crop].push(neighbourhoodPerf);
            futNationalPerfs[crop].push(nationalPerf);
          }
        }
      }
      setHistoricData(newHistoricData);


        
      const histNePerfAvg = (getAvg(histNeighbourhoodPerfs)*100).toFixed(0);
      const histNePerfStd = (getStd(histNeighbourhoodPerfs)*100).toFixed(0);
      const histNaPerfAvg = (getAvg(histNationalPerfs)*100).toFixed(0);
      const histNaPerfStd = (getStd(histNationalPerfs)*100).toFixed(0);
      const histNeighbourhoodPerf = `${histNePerfAvg} % \u00B1 ${histNePerfStd} %`;
      const histNationalPerf = `${histNaPerfAvg} % \u00B1 ${histNaPerfStd} %`;
      setHistPerf({ histNeighbourhoodPerf, histNationalPerf });

      const scoreComponent = Math.min((histNaPerfAvg + histNePerfAvg) / 2, 100);
      if (scoreComponent > 0) {
        setScoreComponents((prev) => {
          if (!prev.histScore) {
            return { ...prev, histScore: Math.round(scoreComponent) };
          }
          return prev;
        });
      }
        
      const futStats = {};
      var bestCrop = '';
      var bestPerf = 0;
      var worstCrop = ''
      var worstPerf = 1000000;
      majorCommodityCrops.forEach(crop => {
        const ne = futNeighbourhoodPerfs[crop] || [];
        const na = futNationalPerfs[crop] || [];
        const neAvg = (getAvg(ne)*100);
        const neStd = (getStd(ne)*100);
        const naAvg = (getAvg(na)*100);
        const naStd = (getStd(na)*100);
        const avgPerf = (neAvg + naAvg) / 2;
        const neighbourhoodPerf = `${neAvg.toFixed(0)} % \u00B1 ${neStd.toFixed(0)} %`;
        const nationalPerf = `${naAvg.toFixed(0)} % \u00B1 ${naStd.toFixed(0)} %`;
        futStats[crop] = { neighbourhoodPerf, nationalPerf, avgPerf };

        if (avgPerf > bestPerf) {
          bestCrop = crop;
          bestPerf = avgPerf;
        }
        if (avgPerf < worstPerf) {
          worstCrop = crop;
          worstPerf = avgPerf;
        }
      });
        
      setFutPerf(futStats);
      setBestProjectedCrop(bestCrop);
      setWorstProjectedCrop(worstCrop);
    }
  }, [yearlyYields, cropsGrown]);

  // Prepare data for the bar plot
  const historicLabels = Object.keys(historicData).map((yr) => historicData[yr].label);
  const historicPropertyYields = Object.keys(historicData).map((yr) => historicData[yr].property);
  const historicNeighbourhoodYields = Object.keys(historicData).map((yr) => historicData[yr].neighbourhood);
  const historicNationalYields = Object.keys(historicData).map((yr) => historicData[yr].national);

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
    .filter((item) => item.Crop === selectedProjectedCrop && item.Year >= minYear && item.Year <= maxYear)
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

  const ProjectionDisplay = () => {
    if (!futPerf) {
      return null;
    }

    const sortedCrops = Object.keys(futPerf).sort((a, b) => {
      return futPerf[b].avgPerf - futPerf[a].avgPerf; // Sort in descending order
    });


    const scoreComponent = Math.min(futPerf[sortedCrops[0]]?.avgPerf, 100);
    if (scoreComponent > 0) {
      setScoreComponents((prev) => {
        if (!prev.futScore) {
          return { ...prev, futScore: Math.round(scoreComponent) };
        }
        return prev;
      });
    }
      
    const countAbove100 = sortedCrops.filter(crop => futPerf[crop].avgPerf > 100).length;
    const headers = ['Crop', 'Neighbourhood', 'National'];

    const data = sortedCrops.map(crop => ({
      crop,
      neighbourhoodPerf: futPerf[crop].neighbourhoodPerf,
      nationalPerf: futPerf[crop].nationalPerf,
    }));
      
    return (
      <div>
        <div className={`${montserrat.className} mb-4 ml-4`}>
          Average Future Yield Comparison
        </div>
        <PlainTable headers={headers} data={data} />
        <div className="flex justify-between mx-4 mb-2">
          <div className="">Highest Performing Projected Crop:</div>
          <div className="">{bestProjectedCrop}</div>
        </div>
        <div className="flex justify-between mx-4 mb-2">
          <div className="">Lowest Performing Projected Crop:</div>
          <div className="">{worstProjectedCrop}</div>
        </div>
        <div className="flex justify-between mx-4">
          <div className="">Crops with Average Performance Above 100%:</div>
          <div className="">{countAbove100}</div>
        </div>
      </div>
    );
  };

  const CropConsistencyDisplay = () => {
    if (!cropHeatMaps) {
      return null;
    }

    const cropsWithNCV = Object.entries(cropHeatMaps).map(([cropName, cropData]) => {
      const { average, stdDev } = cropData;
      const ncv = average !== 0 ? Math.max(0, Math.min(1, stdDev / average)) : 1;
      return { cropName, ncv, average, stdDev };
    });

    if (cropsWithNCV.length === 0) {
      return null;
    }

    // Sort crops by NCV to find most and least consistent
    const sortedCrops = cropsWithNCV.sort((a, b) => a.ncv - b.ncv);
    const mostConsistent = sortedCrops[0];
    const leastConsistent = sortedCrops[sortedCrops.length - 1];

    const headers = ['Crop Name', 'Average', 'Coef. of Variation'];

    const scoreComponent = Math.min((1 - sortedCrops[0].ncv) * 100, 100);
    if (scoreComponent > 0) {
      setScoreComponents((prev) => {
        if (!prev.consScore) {
          return { ...prev, consScore: Math.round(scoreComponent) };
        }
        return prev;
      });
    }
      
    return (
      <div>
        <div className={`${montserrat.className} mb-4 mx-4`}>
          Average Yield Across Property (Bushels/Acre)
        </div>
        <div className="mb-4">
          <PlainTable
            headers={headers}
            data={cropsWithNCV.map(({ cropName, ncv, average, stdDev }) => ({
              cropName,
              average: `${average.toFixed(2)} \u00B1 ${stdDev.toFixed(2)}`,
              ncv: ncv.toFixed(3),
            }))}
          />
        </div>
        <div className="mt-4 mx-4">
          <div className="flex justify-between mb-2">
            <div>Most Consistent Crop:</div>
            <div>{mostConsistent.cropName}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div>Least Consistent Crop:</div>
            <div>{leastConsistent.cropName}</div>
          </div>
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
        <div className="flex">
          <div className="w-[40%] mt-8 p-4">
            <div className={`${montserrat.className} mb-4 mx-4`}>
              Performance Comparison
            </div>
            <div className="flex justify-between mb-2 mx-4">
              <div className="">Crops Grown:</div>
              {cropsGrown && (
                <div>{[...new Set(Object.values(cropsGrown))].join(', ')}</div>
              )}
            </div>
            <div className="flex justify-between mb-2 mx-4">
              <div className="">Average Yield vs Neighbourhood:</div>
              <div className="">{histPerf.histNeighbourhoodPerf}</div>
            </div>
            <div className="flex justify-between mb-2 mx-4">
              <div className="">Average Yield vs National:</div>
              <div className="">{histPerf.histNationalPerf}</div>
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
          <div className="w-[40%] mt-8 p-4">
            <ProjectionDisplay />
          </div>
          <div className="w-[60%]">
            <div className="flex-row justify-center items-center w-full">
              <div className="flex justify-center items-center">
                <div className={`${montserrat.className} mr-4`}>Estimated Projected Yield for:</div>                    
                <Dropdown options={majorCommodityCrops} selected={selectedProjectedCrop} onSelect={setSelectedProjectedCrop} />
              </div>
              <div className="">
                <Plot
                  style={{ width: '100%', height: '100%' }}
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
          <div className="w-[40%] mt-8 p-4">
            <CropConsistencyDisplay />
          </div>
          <div className="w-[60%]">
            {heatMapData && selectedHeatMapCrop && bbox ? (
              <div className="flex w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center h-16">
                    <div className={`${montserrat.className} mr-4`}>Yield Heatmap for:</div>                    
                    <Dropdown options={majorCommodityCrops} selected={selectedHeatMapCrop} onSelect={setSelectedHeatMapCrop} />
                  </div>
                  <MapImage latitude={lat} longitude={lng} zoom={15} bbox={bbox} imageUrl={heatMapData.imageUrl} />
                </div>
                <div className="flex-row ml-2 justify-start items-center mt-16">
                  <div className={`${merriweather.className} text-center`}>
                      Yield
                  </div>
                  <div className="mb-2">(Bushels/Acre)</div>
                  <div className="flex justify-center">
                    <ColorBar
                      vmin={heatMapData.thresholdMin}
                      vmax={heatMapData.thresholdMax}
                      numIntervals={5}
                      heatmapColors={['black', 'red', 'yellow', 'white']}
                    />
                  </div>
                </div>
              </div>
            ) : ( 
              <Loading />
            )}
          </div>
        </div>
      </div>
      {/* <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Crop Diversity Potential</div>
        <p>The amount of crops that can be grown and exceed the neighboring/national levels.</p>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Pest and Disease Resistance</div>
        <p>Historical impact of pests or diseases on crops. Rating based on the average annual yield loss due to pests compared to regional averages.
        </p>
      </div> */}
    </div>
  );
};

export default EstimatedYield;
