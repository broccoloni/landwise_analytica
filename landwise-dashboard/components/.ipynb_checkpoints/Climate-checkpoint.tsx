import React, { useState, useEffect } from 'react';
import { montserrat, merriweather } from '@/ui/fonts';
import Dropdown from '@/components/Dropdown';
import { Slider } from "@mui/material";
import dynamic from 'next/dynamic';

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

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function avg(values) {
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round(sum / values.length);
}

function std(values) {
  const mean = avg(values);
  const variance = values.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / values.length;
  return Math.round(Math.sqrt(variance));
}

const Climate = ({ lat, lng, rasterDataCache, cropHeatMaps, yearlyYields, weatherData }: ClimateProps) => {
  const [years, setYears] = useState<number|null>(null);

  // For precipitation
  const [precipYear, setPrecipYear] = useState<number | null>(null);
  const [precipData, setPrecipData] = useState<any>(null);
    
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
    console.log(weatherData);
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

      setAvgChu(avg(allChu));
      setStdChu(std(allChu));
      setAvgGdd0(avg(allGdd0));
      setStdGdd0(std(allGdd0));
      setAvgGdd5(avg(allGdd5));
      setStdGdd5(std(allGdd5));
      setAvgGdd10(avg(allGdd10));
      setStdGdd10(std(allGdd10));
      setAvgGdd15(avg(allGdd15));
      setStdGdd15(std(allGdd15));

      // For Growing Season
      const getDayOfYear = (date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 0);
        const diff = date - startOfYear;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
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

      const formatDateToMonthName = (dateString) => {
        const date = new Date(dateString);
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}`;
      };
        
      // Calculate growing season metrics
      if (filteredData.length > 0) {
        // Function to extract month and day as a comparable string
        const getMonthDayString = (dateString) => {
          const date = new Date(dateString);
          return `${date.getMonth() + 1}-${date.getDate()}`; // Format as "MM-DD"
        };

        // Get month-day representations of first and last frost dates
        const firstFrostDays = filteredData.map(data => getMonthDayString(data.firstFrost));
        const lastFrostDays = filteredData.map(data => getMonthDayString(data.lastFrost));

        // Calculate earliest and latest first frost (ignoring year)
        const earliestFirstFrost = firstFrostDays.reduce((earliest, current) => 
          earliest < current ? earliest : current
        );
        const latestFirstFrost = firstFrostDays.reduce((latest, current) => 
          latest > current ? latest : current
        );

        setEarliestFirstFrost(formatDateToMonthName(earliestFirstFrost));
        setLatestFirstFrost(formatDateToMonthName(latestFirstFrost));

        // Calculate earliest and latest last frost (ignoring year)
        const earliestLastFrost = lastFrostDays.reduce((earliest, current) => 
          earliest < current ? earliest : current
        );
        const latestLastFrost = lastFrostDays.reduce((latest, current) => 
          latest > current ? latest : current
        );

        setEarliestLastFrost(formatDateToMonthName(earliestLastFrost));
        setLatestLastFrost(formatDateToMonthName(latestLastFrost));

        // Calculate shortest and longest growing season
        const seasonLengths = filteredData.map(data => data.length);
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
    console.log(weatherData);
    if (weatherData && precipYear) {
      const yearlyData = weatherData[precipYear].weatherData;
      setPrecipData({ 
        dates: yearlyData.map(data => data.datetime), 
        precip: yearlyData.map(data => data.precip) 
      });
    }
  }, [precipYear, weatherData]);
    
  return (
    <div>
      <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
        Climate
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Precipitation & Humidity</div>
        <div className = "flex">
          <div className = "w-[40%]">
            Precipitation and humidity stats
          </div>
          <div className="w-[60%]">
            {/* <Plot
              data={[
                {
                  z: weeklyPrecipData,
                  type: 'heatmap',
                  colorscale: 'YlGnBu', // Color scale for the heatmap
                  colorbar: {
                    title: 'Precipitation (mm)', // Title for the color bar
                  },
                },
              ]}
              layout={{
                title: 'Weekly Precipitation Heatmap',
                xaxis: {
                  title: 'Days of Week',
                  tickvals: [0, 1, 2, 3, 4, 5, 6],
                  ticktext: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                },
                yaxis: {
                  title: 'Weeks',
                  autorange: 'reversed', // Reverse the y-axis to have week 1 at the top
                },
                width: 800,
                height: 600,
              }}
            /> */}
          </div>
        </div>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Temperature Suitability</div>
        <div className="flex">
          <div className="w-[40%]">
            <div className = "mt-16 p-4">
              <div className={`${montserrat.className} mb-4`}>
                End of Completed Season Averages
              </div>
              <div className="flex justify-between mb-2">
                <div className="">Corn Heat Units (CHUs):</div>
                <div>{`${avgChu} (\u00B1 ${stdChu})`}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">{`Growind Degree Days (GDDs), Base Temp. 0\u00B0C`}:</div>
                <div>{`${avgGdd0} (\u00B1 ${stdGdd0})`}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">{`Growind Degree Days (GDDs), Base Temp. 5\u00B0C`}:</div>
                <div>{`${avgGdd5} (\u00B1 ${stdGdd5})`}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">{`Growind Degree Days (GDDs), Base Temp. 10\u00B0C`}:</div>
                <div>{`${avgGdd10} (\u00B1 ${stdGdd10})`}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="">{`Growind Degree Days (GDDs), Base Temp. 15\u00B0C`}:</div>
                <div>{`${avgGdd15} (\u00B1 ${stdGdd15})`}</div>
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
            <div className = "mt-16">
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
                        tickvals: Array.from({ length: 365 }, (_, i) => i * growingSeasonNumTicks), // Y-axis ticks from 0 to 364
                        ticktext: Array.from({ length: 365 }, (_, i) => {
                          const date = new Date(2024, 0, 1); // Starting from January 1st
                          date.setDate(date.getDate() + i * growingSeasonNumTicks);
                          return date.toISOString().split('T')[0].slice(5); // Format to MM-DD
                        }),
                        range: [0, 365],
                    },
                    margin: {
                      t: 0,
                      b: 40,
                      l: 100,
                      r: 0
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Climate Resilience</div>
        <p>Climate projections and proximity to mitigation features.</p>
      </div>
      <div className="py-4 border-b border-gray-500">
        <div className={`${montserrat.className} text-lg `}>Flood Risk</div>
        <p>Vulnerability of the land to seasonal flooding or waterlogging.</p>
      </div>
    </div>
  );
};

export default Climate;
