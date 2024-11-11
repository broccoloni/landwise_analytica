'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { montserrat, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import { Slider } from "@mui/material";
import dynamic from 'next/dynamic';
import { getAvg, getStd } from '@/utils/stats';
import { WeatherData, ClimateData } from '@/types/category';
import { formatDateToMonthName, getWeekDateRange, dayNumToMonthDay, monthNames } from '@/utils/dates';
import PlainTable from '@/components/PlainTable';
import { debounce } from 'lodash';
import Loading from '@/components/Loading';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type heatUnit = "Corn Heat Units (CHU)" | "Growing Degree Day (GDD)";
const heatUnits: heatUnit[] = [
  "Corn Heat Units (CHU)",
  "Growing Degree Day (GDD)"
];

const Climate = (
  { lat, lng, climateData, score, setScore }: 
  { lat: number; lng: number; climateData: Record<number, ClimateData>; score: number | null; 
    setScore: React.Dispatch<React.SetStateAction<number | null>>; }) => {
      
  const [scoreComponents, setScoreComponents] = useState<any>({});
  useEffect(() => {
    const scoreValues = Object.values(scoreComponents).map(Number);
    if (scoreValues.length === 3) {
      const avgScore = Math.round(getAvg(scoreValues));
      setScore(avgScore);
    }
  }, [scoreComponents]);
    
  const [years, setYears] = useState<number[]|null>(null);

  // For precipitation
  const [precipYear, setPrecipYear] = useState<number | null>(null);
  const [precipData, setPrecipData] = useState<any>(null);
  const [seasonRange, setSeasonRange] = useState([90,243]);
  const [precipAverages, setPrecipAverages] = useState({ precip: '', temp: '', dew: '' });
  const precipTickFreq = 30;
    
  // For temperature suitability
  const [tempYear, setTempYear] = useState<number | null>(null);
  const [tempData, setTempData] = useState<any>(null);
  const [avgChu, setAvgChu] = useState<number|null>(null);
  const [stdChu, setStdChu] = useState<number|null>(null);
  const [avgGdd0, setAvgGdd0] = useState<number|null>(null);
  const [stdGdd0, setStdGdd0] = useState<number|null>(null);
  const [avgGdd5, setAvgGdd5] = useState<number|null>(null);
  const [stdGdd5, setStdGdd5] = useState<number|null>(null);
  const [avgGdd10, setAvgGdd10] = useState<number|null>(null);
  const [stdGdd10, setStdGdd10] = useState<number|null>(null);
  const [avgGdd15, setAvgGdd15] = useState<number|null>(null);
  const [stdGdd15, setStdGdd15] = useState<number|null>(null);
    
  // For Growing Season 
  const [completedGrowingSeasonData, setCompletedGrowingSeasonData] = useState<Record<number, ClimateData>>([]);
  const [earliestFirstFrost, setEarliestFirstFrost] = useState<string>('');
  const [latestFirstFrost, setLatestFirstFrost] = useState<string>('');
  const [earliestLastFrost, setEarliestLastFrost] = useState<string>('');
  const [latestLastFrost, setLatestLastFrost] = useState<string>('');
  const [shortestGrowingSeason, setShortestGrowingSeason] = useState<string>('');
  const [longestGrowingSeason, setLongestGrowingSeason] = useState<string>('');
  const growingSeasonTickFreq = 30;

  useEffect(() => {
    if (climateData) {
      const dataYears = Object.keys(climateData).map(Number);
      setYears(dataYears);
        
      if (precipYear === null) {
        setPrecipYear(dataYears[0]);
      }
      if (tempYear === null) {
        setTempYear(dataYears[0]);
      }

      // Calculate Temperature metrics
      var allChu: number[] = [];
      var allGdd0: number[] = [];
      var allGdd5: number[] = [];
      var allGdd10: number[] = [];
      var allGdd15: number[] = [];
      dataYears.forEach((year) => {
        const yearlyData = climateData[year];
        if (Object.values(yearlyData.cornHeatUnits).length >= 365) {
          const maxChu = Math.max(...Object.values(yearlyData.cornHeatUnits) as number[]);
          const maxGdd0 = Math.max(...Object.values(yearlyData.GDD0) as number[]);
          const maxGdd5 = Math.max(...Object.values(yearlyData.GDD5) as number[]);
          const maxGdd10 = Math.max(...Object.values(yearlyData.GDD10) as number[]);
          const maxGdd15 = Math.max(...Object.values(yearlyData.GDD15) as number[]);

          allChu.push(maxChu);
          allGdd0.push(maxGdd0);
          allGdd5.push(maxGdd5);
          allGdd10.push(maxGdd10);
          allGdd15.push(maxGdd15);
        }
      });

      setAvgChu(Math.round(getAvg(allChu)));
      setStdChu(Math.round(getStd(allChu)));
      setAvgGdd0(Math.round(getAvg(allGdd0)));
      setStdGdd0(Math.round(getStd(allGdd0)));
      setAvgGdd5(Math.round(getAvg(allGdd5)));
      setStdGdd5(Math.round(getStd(allGdd5)));
      setAvgGdd10(Math.round(getAvg(allGdd10)));
      setStdGdd10(Math.round(getStd(allGdd10)));
      setAvgGdd15(Math.round(getAvg(allGdd15)));
      setStdGdd15(Math.round(getStd(allGdd15)));

      // For Growing Season

      // Filter out entries with null growing season lengths
      const completedGrowingSeasons = Object.values(climateData)
        .filter((data): data is NonNullable<typeof data> => data !== null && data.growingSeasonLength !== null);
      setCompletedGrowingSeasonData(completedGrowingSeasons);
        
      // Calculate growing season metrics
      if (completedGrowingSeasons.length > 0) {
        const firstFrostDays = completedGrowingSeasons.map(data => data.firstFrost);
        const lastFrostDays = completedGrowingSeasons.map(data => data.lastFrost);
        const seasonLengths = completedGrowingSeasons.map(data => data.growingSeasonLength);
          
        const earliestFirstFrostDay = Math.min(...firstFrostDays);
        const latestFirstFrostDay = Math.max(...firstFrostDays);
        setEarliestFirstFrost(formatDateToMonthName(dayNumToMonthDay(earliestFirstFrostDay)));
        setLatestFirstFrost(formatDateToMonthName(dayNumToMonthDay(latestFirstFrostDay)));
        
        const earliestLastFrostDay = Math.min(...lastFrostDays);
        const latestLastFrostDay = Math.max(...lastFrostDays);
        setEarliestLastFrost(formatDateToMonthName(dayNumToMonthDay(earliestLastFrostDay)));
        setLatestLastFrost(formatDateToMonthName(dayNumToMonthDay(latestLastFrostDay)));

        const shortestSeason = Math.min(...seasonLengths);
        const longestSeason = Math.max(...seasonLengths);
        setShortestGrowingSeason(`${shortestSeason} days`);
        setLongestGrowingSeason(`${longestSeason} days`);
      }
    }
  }, [climateData]);

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
    if (climateData && tempYear) {
      const data = climateData[tempYear];
      setTempData([
        prepareTempDataForPlot(data.cornHeatUnits,'CHU'),
        prepareTempDataForPlot(data.GDD0,'GDD - Base Temp. 0\u00B0C'),
        prepareTempDataForPlot(data.GDD5,'GDD - Base Temp. 5\u00B0C'),
        prepareTempDataForPlot(data.GDD10,'GDD - Base Temp. 10\u00B0C'),
        prepareTempDataForPlot(data.GDD15,'GDD - Base Temp. 15\u00B0C'),
      ]);
    }  
  }, [tempYear, climateData]);

  useEffect(() => {
    if (precipYear && climateData) {
      const yearlyData = climateData[precipYear].weatherData;
      setPrecipData({
        precip: Object.values(yearlyData).map((data: WeatherData) => data.precip),
        temp: Object.values(yearlyData).map((data: WeatherData) => data.temp),
        dew: Object.values(yearlyData).map((data: WeatherData) => data.dew),
        dayOfYear: Object.values(yearlyData).map((data: WeatherData) => data.dayOfYear),
        x: Object.values(yearlyData).map((data: WeatherData) => `${monthNames[data.month-1]} ${data.day}`),
      });
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
                  {years && (
                    <div className="w-56">
                      <Slider
                        value={precipYear ?? years[0]}
                        onChange={(event, newValue) => setPrecipYear(newValue as number)}
                        min={Math.min(...years)}
                        max={Math.max(...years)}
                        step={1}
                        marks={years.map((year) => ({
                          value: year,
                          label: (year === Math.min(...years) || year === Math.max(...years) || year === precipYear)
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
        {tempData && years ? (
          <div className="flex">
            <div className="w-[40%]">
              <div className = "mt-8 p-4 mx-4">
                <div className={`${montserrat.className} mb-4`}>
                  End of Completed Season Averages
                </div>
                <div className="flex justify-between mb-2">
                  <div className="">Corn Heat Units (CHUs):</div>
                  <div>{`${avgChu} \u00B1 ${stdChu}`}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-row">
                    <div>{`Growind Degree Days (GDDs)`}</div>
                    <div>{`Base Temp. 0\u00B0C`}</div>
                  </div>
                  <div>{`${avgGdd0} \u00B1 ${stdGdd0}`}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-row">
                    <div>{`Growind Degree Days (GDDs)`}</div>
                    <div>{`Base Temp. 5\u00B0C`}</div>
                  </div>
                  <div>{`${avgGdd5} \u00B1 ${stdGdd5}`}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-row">
                    <div>{`Growind Degree Days (GDDs)`}</div>
                    <div>{`Base Temp. 10\u00B0C`}</div>
                  </div>
                  <div>{`${avgGdd10} \u00B1 ${stdGdd10}`}</div> 
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex-row">
                    <div>{`Growind Degree Days (GDDs)`}</div>
                    <div>{`Base Temp. 15\u00B0C`}</div>
                  </div>
                  <div>{`${avgGdd15} \u00B1 ${stdGdd15}`}</div>
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
                    value={tempYear ?? years[0]}
                    onChange={(event, newValue) => setTempYear(newValue as number)}
                    min={Math.min(...years)}
                    max={Math.max(...years)}
                    step={1}
                    marks={years.map((year) => ({
                      value: year,
                      label: (year === Math.min(...years) || year === Math.max(...years) || year === tempYear)
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
        {completedGrowingSeasonData && earliestFirstFrost ? (
          <div className="flex">
            <div className="w-[40%]">
              <div className = "mt-8 mx-4">
                <div className={`${montserrat.className} mb-4`}>
                  Summary
                </div>
                <div className="flex justify-between mb-2">
                  <div className="">Earliest First Frost Date:</div>
                  <div>{earliestFirstFrost}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="">Latest First Frost Date:</div>
                  <div>{latestFirstFrost}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="">Earliest Last Frost Date:</div>
                  <div>{earliestLastFrost}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="">Lastest Last Frost Date:</div>
                  <div>{latestLastFrost}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="">Shortest Growing Season:</div>
                  <div>{shortestGrowingSeason}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="">Longest Growing Season:</div>
                  <div>{longestGrowingSeason}</div>
                </div>
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
                        x: completedGrowingSeasonData.map(data => Object.values(data.weatherData)[0].year),
                        y: completedGrowingSeasonData.map(data => data.lastFrost),
                        type: 'bar',
                        orientation: 'v',
                        marker: { color: 'rgba(0,0,0,0)' }, // Make the base bars transparent
                        showlegend: false,
                        hoverinfo: 'skip',
                      },
                      // Visible growing season length bars
                      {
                        x: completedGrowingSeasonData.map(data => Object.values(data.weatherData)[0].year),
                        y: completedGrowingSeasonData.map(data => data.growingSeasonLength),
                        type: 'bar',
                        orientation: 'v',
                        hoverinfo: 'text',
                        text: completedGrowingSeasonData.map(
                          data => `Year: ${Object.values(data.weatherData)[0].year}<br>Growing Season Length: ${data.growingSeasonLength} days<br>Last Frost Date: ${Object.keys(data.weatherData)[data.lastFrost-1]}<br>First Frost Date: ${Object.keys(data.weatherData)[data.firstFrost-1]}`
                        ),
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
                        tickvals: completedGrowingSeasonData.map(data => Object.values(data.weatherData)[0].year),
                        range: [
                          Math.min(...completedGrowingSeasonData.map(data => Object.values(data.weatherData)[0].year)) - 0.8,
                          Math.max(...completedGrowingSeasonData.map(data => Object.values(data.weatherData)[0].year)) + 0.8,
                        ],
                      },
                      yaxis: {
                        title: 'Date',
                        tickvals: Object.keys(completedGrowingSeasonData[0].weatherData)
                          .map((_, index) => index)
                          .filter((_, index) => index % growingSeasonTickFreq === 0),
                        ticktext: Object.keys(completedGrowingSeasonData[0].weatherData)
                          .filter((_, index) => index % growingSeasonTickFreq === 0),
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
