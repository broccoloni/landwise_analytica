'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { montserrat, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import { Slider } from "@mui/material";
import dynamic from 'next/dynamic';
import { getAvg, getStd } from '@/utils/stats';
import { formatDateToMonthName, dayNumToMonthDay, monthNames } from '@/utils/dates';
import PlainTable from '@/components/PlainTable';
import { debounce } from 'lodash';
import Loading from '@/components/Loading';
import { ImageAndLegend, ImageAndStats, PerformanceData} from '@/types/dataTypes';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type heatUnit = "Corn Heat Units (CHU)" | "Growing Degree Day (GDD)";
const heatUnits: heatUnit[] = [
  "Corn Heat Units (CHU)",
  "Growing Degree Day (GDD)"
];

const Climate = (
  { lat, lng, heatUnitData, growingSeasonData, climateData, score, setScore }: 
  { lat: number|null; lng: number|null; heatUnitData: any; growingSeasonData: any; climateData: any; score: number | null; 
    setScore: React.Dispatch<React.SetStateAction<number | null>>; }) => {
      
  const [scoreComponents, setScoreComponents] = useState<any>({});
  useEffect(() => {
    const scoreValues = Object.values(scoreComponents).map(Number);
    if (scoreValues.length === 3) {
      const avgScore = Math.round(getAvg(scoreValues));
      setScore(avgScore);
    }
  }, [scoreComponents]);
    
  // For precipitation
  const [precipYear, setPrecipYear] = useState<number | null>(null);
  const [precipData, setPrecipData] = useState<any>(null);
  const [seasonRange, setSeasonRange] = useState([90,243]);
  const [precipAverages, setPrecipAverages] = useState({ precip: '', temp: '', dew: '' });
  const precipTickFreq = 30;
    
  // For temperature suitability
  const [tempYear, setTempYear] = useState<number | null>(null);
  const [tempData, setTempData] = useState<any>(null);
    
  // For Growing Season 
  const growingSeasonTickFreq = 30;

 const prepareTempDataForPlot = (data: any, name: string) => {
    const xValues = Object.keys(data);
    const yValues = Object.values(data);
    return {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: name,
    };
  }
      
  useEffect(() => {
    if (heatUnitData && !tempYear) {
      setTempYear(Object.keys(heatUnitData.chu.data).map(Number)[0]);
    }
      
    if (heatUnitData && tempYear) {
      // Make across heat units rather than years
      setTempData([
        prepareTempDataForPlot(heatUnitData.chu.data[tempYear],'CHU'),
        prepareTempDataForPlot(heatUnitData.gdd0.data[tempYear],'GDD - Base Temp. 0\u00B0C'),
        prepareTempDataForPlot(heatUnitData.gdd5.data[tempYear],'GDD - Base Temp. 5\u00B0C'),
        prepareTempDataForPlot(heatUnitData.gdd10.data[tempYear],'GDD - Base Temp. 10\u00B0C'),
        prepareTempDataForPlot(heatUnitData.gdd15.data[tempYear],'GDD - Base Temp. 15\u00B0C'),
      ]);
    }
  }, [heatUnitData, tempYear]);

  useEffect(() => {
    if (!precipYear && climateData) {
      setPrecipYear(Object.keys(climateData).map(Number)[0]);
    } 
    if (precipYear && climateData) {       
      setPrecipData(climateData[precipYear])
    }
  }, [precipYear, climateData]);

  const handleRelayout = useCallback(
    debounce((event) => {
      const newRange = event['xaxis.range'];

      if (newRange !== undefined) {
        const newRangeStart = Math.max(0, Math.round(newRange[0]));
        const newRangeEnd = Math.min(365, Math.round(newRange[1]));
        setSeasonRange([newRangeStart, newRangeEnd]);
      }
    }, 1200),
    []
  );

  useEffect(() => {
    if (seasonRange && precipData) {
      const [start, end] = seasonRange;

      const avgPrecip = getAvg(precipData.precip.slice(start, end + 1));
      const avgTemp = getAvg(precipData.temp.slice(start, end + 1));    
      const avgDew = getAvg(precipData.dew.slice(start, end + 1));
      const stdPrecip = getStd(precipData.precip.slice(start, end + 1));
      const stdTemp = getStd(precipData.temp.slice(start, end + 1));
      const stdDew = getStd(precipData.dew.slice(start, end + 1));

      const count = end - start + 1;
 
      if (count > 0) {
        setPrecipAverages({
          precip: `${avgPrecip.toFixed(2)} \u00B1 ${stdPrecip.toFixed(2)}`,
          temp:  `${avgTemp.toFixed(2)} \u00B1 ${stdTemp.toFixed(2)}`,
          dew:  `${avgDew.toFixed(2)} \u00B1 ${stdDew.toFixed(2)}`,
        });
      } else {
        setPrecipAverages({ precip: '', temp: '', dew: '' });
      }
    }
  }, [seasonRange, precipData]);
    
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Climate
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Precipitation, Temperature & Dew</div>
        {precipData ? (
          <div className = "flex">
            <div className = "w-[40%]">
              <div className = "mt-8 p-4 mx-4">
                <div className={`${montserrat.className} mb-4 flex justify-between`}>
                  <div>
                    Summary of Selected Range
                  </div>
                  {precipData && seasonRange && (
                    <div>
                      {precipData.x[seasonRange[0]]} - {precipData.x[seasonRange[1]]}
                    </div>
                  )}
                </div>
                {seasonRange && precipAverages && precipData && (
                  <div className="">
                    <PlainTable
                      headers={['Climate Variable','Average Over Selected Range']}
                      data = {[ 
                        { v: 'Precipitation', a: precipAverages.precip },
                        { v: 'Temperature', a: precipAverages.temp },
                        { v: 'Dew', a: precipAverages.dew },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-[60%]">
              <div className="flex-row justify-center items-center">
                <div className="flex justify-center items-center text-center">
                  <div className={`${montserrat.className} mr-8`}>
                    Daily Average For Each Week of
                  </div>
                  {climateData && (
                    <div className="w-56">
                      <Slider
                        value={precipYear ?? Object.keys(climateData).map(Number)[0]}
                        onChange={(event, newValue) => setPrecipYear(newValue as number)}
                        min={Math.min(...Object.keys(climateData).map(Number))}
                        max={Math.max(...Object.keys(climateData).map(Number))}
                        step={1}
                        marks={ Object.keys(climateData).map(Number).map((year) => ({
                          value: year,
                          label: (year === Math.min(...Object.keys(climateData).map(Number)) || year === Math.max(...Object.keys(climateData).map(Number)) || year === precipYear)
                            ? year.toString()
                            : ''
                        }))}
                        valueLabelDisplay="auto"
                      />
                    </div>
                  )}
                </div>
                <div className="">
                  {precipData && (
                    <Plot
                      data={[
                        {
                          z: [precipData.precip],
                          x: precipData.x,                        
                          y: [0],
                          type: 'heatmap',
                          colorscale: 'Blues',
                          reversescale: true,
                          colorbar: {
                            len: 0.3,
                            y: 0.15
                          },
                          showscale: true,
                        },
                        {
                          z: [precipData.temp],
                          x: precipData.x, 
                          y: [1],
                          type: 'heatmap',
                          colorscale: 'Purples',
                          colorbar: {
                            len: 0.3,
                            y: 0.5
                          },
                          showscale: true,
                        },
                        {
                          z: [precipData.dew],
                          x: precipData.x, 
                          y: [2],
                          type: 'heatmap',
                          colorscale: 'Greens',
                          colorbar: {
                            len: 0.3,
                            y: 0.85
                          },
                          showscale: true,
                        },
                      ]}
                      layout={{
                        xaxis: {
                          title: 'Range Selection',
                          // tickvals: precipData.dayOfYear.filter((_: string, index: number) => index % precipTickFreq === 0),
                          tickvals: precipData.x.filter((_: string, index: number) => index % precipTickFreq === 0),
                          rangeslider: {
                            visible: true,
                          },
                          range: seasonRange,
                        },
                        yaxis: {
                          title: '',
                          tickvals: [0, 1, 2],
                          ticktext: ['Precipitation (mm)', 'Temperature (\u00B0C)', 'Dew (\u00B0C)']
                        },
                        margin: {
                          t: 10,
                          b: 100,
                          l: 120,
                          r: 0,
                        },
                      }}
                      style={{ width: '100%', height: '100%' }}
                      onRelayout={handleRelayout}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Temperature Suitability</div>
        {heatUnitData ? (
          <div className="flex">
            <div className="w-[40%]">
              <div className = "mt-8 p-4 mx-4">
                <div className={`${montserrat.className} mb-4`}>
                  End of Completed Season Averages
                </div>
                <div className="flex justify-between mb-2">
                  <div className="">Corn Heat Units (CHUs):</div>
                  <div>{`${Math.round(heatUnitData.chu.avg)} \u00B1 ${Math.round(heatUnitData.chu.std)}`}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-row">
                    <div>{`Growind Degree Days (GDDs)`}</div>
                    <div>{`Base Temp. 0\u00B0C`}</div>
                  </div>
                  <div>{`${Math.round(heatUnitData.gdd0.avg)} \u00B1 ${Math.round(heatUnitData.gdd0.std)}`}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-row">
                    <div>{`Growind Degree Days (GDDs)`}</div>
                    <div>{`Base Temp. 5\u00B0C`}</div>
                  </div>
                  <div>{`${Math.round(heatUnitData.gdd5.avg)} \u00B1 ${Math.round(heatUnitData.gdd5.std)}`}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-row">
                    <div>{`Growind Degree Days (GDDs)`}</div>
                    <div>{`Base Temp. 10\u00B0C`}</div>
                  </div>
                  <div>{`${Math.round(heatUnitData.gdd10.avg)} \u00B1 ${Math.round(heatUnitData.gdd10.std)}`}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-row">
                    <div>{`Growind Degree Days (GDDs)`}</div>
                    <div>{`Base Temp. 15\u00B0C`}</div>
                  </div>
                  <div>{`${Math.round(heatUnitData.gdd15.avg)} \u00B1 ${Math.round(heatUnitData.gdd15.std)}`}</div>
                </div>
              </div> 
            </div>
            <div className="w-[60%]">
              <div className="flex-row justify-center items-center">
                <div className="flex justify-center items-center text-center">
                  <div className={`${montserrat.className} mr-8`}>
                    Year:
                  </div>
                  <div className="w-56">
                  <Slider
                    value={tempYear ?? heatUnitData.years[0]}
                    onChange={(event, newValue) => setTempYear(newValue as number)}
                    min={Math.min(...heatUnitData.years)}
                    max={Math.max(...heatUnitData.years)}
                    step={1}
                    marks={heatUnitData.years.map((year: number) => ({
                      value: year,
                      label: (year === Math.min(...heatUnitData.years) || year === Math.max(...heatUnitData.years) || year === tempYear)
                        ? year.toString()
                          : ''
                      }))}
                    valueLabelDisplay="auto"
                  />
                  </div>
                </div>
                <div className="">
                  <Plot
                    data={tempData}
                    layout={{
                      xaxis: { title: 'Date' },
                      yaxis: { title: 'Cumulative Heat Units' },
                      margin: {
                        t: 20,
                        b: 40,
                        l: 60,
                        r: 20
                      },
                      legend: {
                        x: 0.02,
                        y: 0.98,
                        xanchor: 'left',
                        yanchor: 'top',
                        orientation: 'v',
                        bgcolor: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
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
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Growing Season Length</div>
        {growingSeasonData ? (
          <div className="flex">
            <div className="w-[40%]">
              <div className = "mt-8 mx-4">
                <div className={`${montserrat.className} mb-4`}>
                  Summary
                </div>
                <PlainTable
                  headers={['Variable','Average']}
                  data = {[ 
                    { v: 'Last Frost Date', a: `${growingSeasonData.lastFrosts.avgStr} \u00B1 ${growingSeasonData.lastFrosts.std} days` },
                    { v: 'First Frost Date', a: `${growingSeasonData.firstFrosts.avgStr} \u00B1 ${growingSeasonData.firstFrosts.std} days` },
                    { v: 'Growing Season Length', a: `${growingSeasonData.seasons.avg} \u00B1 ${growingSeasonData.seasons.std} days` },
                  ]}
                />
              </div>
            </div>
            <div className="w-[60%]">
              <div className="flex-row">
                <div className={`${montserrat.className} w-full text-center`}>
                  Completed Growing Seasons
                </div>
                <div className="">
                  <Plot
                    data={[
                      // Invisible base bars
                      {
                        x: growingSeasonData.x,
                        y: growingSeasonData.y0,
                        type: 'bar',
                        orientation: 'v',
                        marker: { color: 'rgba(0,0,0,0)' }, // Make the base bars transparent
                        showlegend: false,
                        hoverinfo: 'skip',
                      },
                      // Visible growing season length bars
                      {
                        x: growingSeasonData.x,
                        y: growingSeasonData.y1,
                        type: 'bar',
                        orientation: 'v',
                        hoverinfo: 'text',
                        text: growingSeasonData.desc,
                        textposition: 'none',
                        marker: { color: 'green' },
                        showlegend: false,
                      },
                    ]}
                    layout={{
                      barmode: 'stack', // Stack the two series to simulate offset bars
                      xaxis: {
                        title: 'Year',
                        zeroline: false,
                        tickvals: growingSeasonData.x,
                        range: [ Math.min(...growingSeasonData.x) - 1, Math.max(...growingSeasonData.x) + 1 ],
                      },
                      yaxis: {
                        title: 'Date',
                        tickvals: growingSeasonData.ylabels.map((_:any, index:number) => index).filter((_:any, index:number) => index % growingSeasonTickFreq === 0),
                        ticktext: growingSeasonData.ylabels.filter((_:any, index:number) => index % growingSeasonTickFreq === 0),
                        range: [0, 365],
                      },
                      margin: {
                        t: 0,
                        b: 40,
                        l: 100,
                        r: 0,
                      },
                    }}
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
    </div>
  );
};

export default Climate;
