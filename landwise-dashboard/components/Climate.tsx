import React, { useState, useEffect } from 'react';
import { montserrat, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import { Slider } from "@mui/material";
import dynamic from 'next/dynamic';
import { getAvg, getStd } from '@/utils/stats';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ClimateProps {
  lat: string;
  lng: string;
  rasterDataCache: any;
  cropHeatMaps: any;
  yearlyYields: any;
  weatherData: any;
}

type heatUnit = "Corn Heat Units (CHU)" | "Growing Degree Day (GDD)";
const heatUnits: heatUnit[] = [
  "Corn Heat Units (CHU)",
  "Growing Degree Day (GDD)"
];

const dayNumToMonthDay = (dayNum) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + dayNum);
  return date.toISOString().split('T')[0].slice(5); // Format to MM-DD
};

const monthNames = [
  "Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
  "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
];

const formatDateToMonthName = (dateString) => {
  const date = new Date(dateString);
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

const getWeekDateRange = (weekNumber) => {
  if (isNaN(Number(weekNumber))) {
    return weekNumber;
  }
  const weekStart = formatDateToMonthName(dayNumToMonthDay((weekNumber - 1) * 7)); 
  const weekEnd = formatDateToMonthName(dayNumToMonthDay(weekNumber * 7));
  return `${weekStart} - ${weekEnd}`;
};

const Climate = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields, weatherData }: ClimateProps) => {
  const [years, setYears] = useState<number|null>(null);

  // For precipitation
  const [precipYear, setPrecipYear] = useState<number | null>(null);
  const [precipData, setPrecipData] = useState<any>(null);
  const precipTickFreq = 4;
    
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
  const [growingSeasonData, setGrowingSeasonData] = useState<{ year: number; length: number; start: string; end: string }[]>([]);
  const [earliestFirstFrost, setEarliestFirstFrost] = useState<string>('');
  const [latestFirstFrost, setLatestFirstFrost] = useState<string>('');
  const [earliestLastFrost, setEarliestLastFrost] = useState<string>('');
  const [latestLastFrost, setLatestLastFrost] = useState<string>('');
  const [shortestGrowingSeason, setShortestGrowingSeason] = useState<string>('');
  const [longestGrowingSeason, setLongestGrowingSeason] = useState<string>('');
  const growingSeasonNumTicks = 30;

  useEffect(() => {
    if (weatherData) {
      const dataYears = Object.keys(weatherData).map(Number);
      setYears(dataYears);
        
      if (precipYear === null) {
        setPrecipYear(dataYears[0]);
      }
      if (tempYear === null) {
        setTempYear(dataYears[0]);
      }

      // Calculate Temperature metrics
      var allChu = [];
      var allGdd0 = [];
      var allGdd5 = [];
      var allGdd10 = [];
      var allGdd15 = [];
      dataYears.forEach((year) => {
        const yearlyData = weatherData[year];
        if (Object.values(yearlyData.cornHeatUnits).length >= 365) {
          const maxChu = Math.max(...Object.values(yearlyData.cornHeatUnits));
          const maxGdd0 = Math.max(...Object.values(yearlyData.GDD0));
          const maxGdd5 = Math.max(...Object.values(yearlyData.GDD5));
          const maxGdd10 = Math.max(...Object.values(yearlyData.GDD10));
          const maxGdd15 = Math.max(...Object.values(yearlyData.GDD15));

          allChu.push(maxChu);
          allGdd0.push(maxGdd0);
          allGdd5.push(maxGdd5);
          allGdd10.push(maxGdd10);
          allGdd15.push(maxGdd15);
        }
      });

      setAvgChu(getAvg(allChu).toFixed(0));
      setStdChu(getStd(allChu).toFixed(0));
      setAvgGdd0(getAvg(allGdd0).toFixed(0));
      setStdGdd0(getStd(allGdd0).toFixed(0));
      setAvgGdd5(getAvg(allGdd5).toFixed(0));
      setStdGdd5(getStd(allGdd5).toFixed(0));
      setAvgGdd10(getAvg(allGdd10).toFixed(0));
      setStdGdd10(getStd(allGdd10).toFixed(0));
      setAvgGdd15(getAvg(allGdd15).toFixed(0));
      setStdGdd15(getStd(allGdd15).toFixed(0));

      // For Growing Season
      const getDayOfYear = (date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 0);
        const diff = date - startOfYear;
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
      };
        
      const lengthsData = dataYears.map((year) => {
        const yearlyData = weatherData[year];
        const startDate = new Date(yearlyData?.lastFrost);
        const endDate = new Date(yearlyData?.firstFrost);
        return {
          year,
          length: yearlyData?.growingSeasonLength,
          start: getDayOfYear(startDate),
          end: getDayOfYear(endDate),
          lastFrost: yearlyData?.lastFrost,
          firstFrost: yearlyData?.firstFrost,
        };
      });

      // Filter out entries with null growing season lengths
      const filteredData = lengthsData.filter(data => data.length !== null);
      setGrowingSeasonData(filteredData);
        
      // Calculate growing season metrics
      if (filteredData.length > 0) {
        const firstFrostDays = filteredData.map(data => data.end);
        const lastFrostDays = filteredData.map(data => data.start);
        const seasonLengths = filteredData.map(data => data.length);
          
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
  }, [weatherData]);

  const prepareTempDataForPlot = (data, name: string) => {
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
    if (weatherData && tempYear) {
      const data = weatherData[tempYear];
      setTempData([
        prepareTempDataForPlot(data.cornHeatUnits,'CHU'),
        prepareTempDataForPlot(data.GDD0,'GDD - Base Temp. 0\u00B0C'),
        prepareTempDataForPlot(data.GDD5,'GDD - Base Temp. 5\u00B0C'),
        prepareTempDataForPlot(data.GDD10,'GDD - Base Temp. 10\u00B0C'),
        prepareTempDataForPlot(data.GDD15,'GDD - Base Temp. 15\u00B0C'),
      ]);
    }  
  }, [tempYear, weatherData]);

  useEffect(() => {
    if (weatherData && precipYear) {
      const yearlyData = weatherData[precipYear].weatherData;
      if (yearlyData.length > 0) {
        const daysPerWeek = 7;
        const weeklyAvgs = [Array(52).fill(0), Array(52).fill(0), Array(52).fill(0)];
        const counts = Array(52).fill(0);
        const dates = yearlyData.map(data => data.datetime);
        const precip = yearlyData.map(data => data.precip);
        const humidity = yearlyData.map(data => data.humidity);
        const dew = yearlyData.map(data => data.dew);
          
        dates.forEach((date, index) => {
          const weekIndex = Math.min(51,Math.floor(index / daysPerWeek));
          weeklyAvgs[0][weekIndex] += precip[index];
          weeklyAvgs[1][weekIndex] += humidity[index];
          weeklyAvgs[2][weekIndex] += dew[index];
          counts[weekIndex] += 1;
        });

        weeklyAvgs.forEach((metricArray, metricIndex) => {
          weeklyAvgs[metricIndex] = metricArray.map((sum, weekIndex) => 
            counts[weekIndex] > 0 ? sum / counts[weekIndex] : 0
          );
        });
       
        const xValues = Array.from({ length: 52 }, (_, i) => i + 1);
        const xNames = xValues.map(x => getWeekDateRange(x));
        setPrecipData({ 
          precip: weeklyAvgs[0], 
          humidity: weeklyAvgs[1], 
          dew: weeklyAvgs[2], 
          xValues, 
          xNames 
        });
      }        
    }
  }, [precipYear, weatherData]);
    
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Climate
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Precipitation, Humidity & Dew</div>
        <div className = "flex">
          <div className = "w-[40%]">
            <div className = "mt-8 p-4 mx-4">
              <div className={`${montserrat.className} mb-4`}>
                Summary
              </div>
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
                        x: precipData.xNames,                        
                        y: [0],
                        type: 'heatmap',
                        colorscale: 'Blues',
                        colorbar: {
                          len: 0.3,
                          y: 0.15
                        },
                        showscale: true,
                      },
                      {
                        z: [precipData.humidity],
                        x: precipData.xNames, 
                        y: [1],
                        type: 'heatmap',
                        colorscale: 'Greens',
                        colorbar: {
                          len: 0.3,
                          y: 0.5
                        },
                        showscale: true,
                      },
                      {
                        z: [precipData.dew],
                        x: precipData.xNames, 
                        y: [2],
                        type: 'heatmap',
                        colorscale: 'Purples',
                        colorbar: {
                          len: 0.3,
                          y: 0.85
                        },
                        showscale: true,
                      },
                    ]}
                    layout={{
                      xaxis: {
                        title: 'Week of Year',
                        tickvals: precipData.xNames.filter((_, index) => index % precipTickFreq === 0),
                      },
                      yaxis: {
                        title: '',
                        tickvals: [0, 1, 2],
                        ticktext: ['Precipitation (mm)', 'Humidity (%)', 'Dew (\u00B0C)']
                      },
                      margin: {
                        t: 10,
                        b: 100,
                        l: 120,
                        r: 0,
                      },
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Temperature Suitability</div>
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
                {years && (
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
                )}
              </div>
              <div className="">
                {tempData && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Growing Season Length</div>
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
                    {
                        x: growingSeasonData.map(data => data.year),
                        y: growingSeasonData.map(data => data.length),
                        base: growingSeasonData.map(data => data.start),
                        type: 'bar',
                        orientation: 'v',
                        hoverinfo: 'text',
                        text: growingSeasonData.map(data => `Year: ${data.year}<br>Growing Season Length: ${data.length} days<br>Last Frost Date: ${data.lastFrost} <br>First Frost Date: ${data.firstFrost}`),
                        textposition: 'none'
                    },
                  ]}
                  layout={{
                    xaxis: {
                        title: 'Year',
                        zeroline: false,
                        tickvals: growingSeasonData.map(data => data.year),
                    },
                    yaxis: {
                        title: 'Date',
                        tickvals: Array.from({ length: Math.round(365/growingSeasonNumTicks) }, (_, i) => i * growingSeasonNumTicks), // Y-axis ticks from 0 to 364
                        ticktext: Array.from({ length: Math.round(365/growingSeasonNumTicks) }, (_, i) => dayNumToMonthDay(i * growingSeasonNumTicks)),
                        range: [0, 365],
                    },
                    margin: {
                      t: 0,
                      b: 40,
                      l: 100,
                      r: 0
                    },
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Climate Resilience</div>
        <p>Climate projections and proximity to mitigation features.</p>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Flood Risk</div>
        <p>Vulnerability of the land to seasonal flooding or waterlogging.</p>
      </div> */}
    </div>
  );
};

export default Climate;
