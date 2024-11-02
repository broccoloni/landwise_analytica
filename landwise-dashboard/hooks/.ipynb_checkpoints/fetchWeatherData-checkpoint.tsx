import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { WeatherData, ClimateData } from '@/types/climateData';

type FrostDates = {
  firstFrost: string | null;
  lastFrost: string | null;
  growingSeasonLength: number | null;
};

type YearlyClimateSummary = Record<number, ClimateData>;

export const fetchWeatherData = (basePath: string) => {
  const [yearlyClimateSummary, setYearlyClimateSummary] = useState<YearlyClimateSummary>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(`${basePath}/demo/weather.csv`, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data: WeatherData[] = results.data.map((row: any) => ({
          datetime: row.datetime,
          tempmin: parseFloat(row.tempmin),
          tempmax: parseFloat(row.tempmax),
          temp: parseFloat(row.temp),
          precip: parseFloat(row.precip),
          humidity: parseFloat(row.humidity),
          dew: parseFloat(row.dew),
          windgust: parseFloat(row.windgust),
          windspeed: parseFloat(row.windspeed),
          winddir: parseFloat(row.winddir),
        }));
        processYearlyClimateData(data);
        setLoading(false);
      },
    });
  }, []);

  const processYearlyClimateData = (data: WeatherData[]) => {
    const yearlyData: YearlyClimateSummary = {};

    // Group data by year
    const dataByYear: Record<number, WeatherData[]> = data.reduce((acc, day) => {
      if (day.datetime) {
        const year = parseInt(day.datetime.substring(0, 4));
        
        if (!acc[year]) acc[year] = [];
        acc[year].push(day);
      }
      return acc;
    }, {} as Record<number, WeatherData[]>);

    // Calculate frost dates and add weather data for each year
    Object.keys(dataByYear).forEach((yearString) => {
      const year = parseInt(yearString);
      const { firstFrost, lastFrost, growingSeasonLength } = calculateFrostDates(dataByYear[year]);
      yearlyData[year] = {
        weatherData: dataByYear[year],
        firstFrost,
        lastFrost,
        growingSeasonLength,
        cornHeatUnits: calculateCornHeatUnits(dataByYear[year], lastFrost, firstFrost),
        GDD0: calculateGDD(dataByYear[year], 0, lastFrost, firstFrost),
        GDD5: calculateGDD(dataByYear[year], 5, lastFrost, firstFrost),
        GDD10: calculateGDD(dataByYear[year], 10, lastFrost, firstFrost),
        GDD15: calculateGDD(dataByYear[year], 15, lastFrost, firstFrost),
      };
    });

    setYearlyClimateSummary(yearlyData);
  };

  const calculateFrostDates = (data: WeatherData[]): FrostDates => {
    const frostDays = data.filter((day) => day.tempmin <= 0);
    const julyFirst = new Date(`${data[0].datetime.substring(0, 4)}-07-01`);
    
    const frostDaysBeforeJuly = frostDays.filter((day) => new Date(day.datetime) < julyFirst);
    const frostDaysAfterJuly = frostDays.filter((day) => new Date(day.datetime) > julyFirst);

    const lastFrost = frostDaysBeforeJuly.reduce((closest, current) => {
      const currentDate = new Date(current.datetime);
      return Math.abs(currentDate.getTime() - julyFirst.getTime()) <
        Math.abs(new Date(closest.datetime).getTime() - julyFirst.getTime())
        ? current
        : closest;
    }, frostDaysBeforeJuly[0])?.datetime || null;

    const firstFrost = frostDaysAfterJuly.reduce((closest, current) => {
      const currentDate = new Date(current.datetime);
      return Math.abs(currentDate.getTime() - julyFirst.getTime()) <
        Math.abs(new Date(closest.datetime).getTime() - julyFirst.getTime())
        ? current
        : closest;
    }, frostDaysAfterJuly[0])?.datetime || null;

    let growingSeasonLength: number | null = null;
    if (firstFrost && lastFrost) {
      const firstDate = new Date(firstFrost);
      const lastDate = new Date(lastFrost);
      growingSeasonLength = Math.ceil(
        (firstDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return { firstFrost, lastFrost, growingSeasonLength };
  };

  const calculateCornHeatUnits = (data: WeatherData[]): Record<string, number> => {
      const chuMapping: Record<string, number> = {};
      let cumulativeChu = 0;
      data.forEach((day) => {
        // Limit maximum temperature for calculation purposes
        const maxTemp = Math.min(day.tempmax, 30); // Cap at 30°C
        const minTemp = day.tempmin; // Minimum should be >= 4.4°C due to check above
    
        // Corn Heat Unit formula from government website
        const chu = ((1.8 * (minTemp - 4.4)) + (3.33 * (maxTemp - 10)) - (0.084 * Math.pow((maxTemp - 10), 2))) / 2.0;

        cumulativeChu += Math.max(0, chu);
        chuMapping[day.datetime] = cumulativeChu;
          
        // Ensure CHU is non-negative and store it in the mapping
        if (day.tempmin < 4.4) {
          chuMapping[day.datetime] = cumulativeChu;
        }
        else {
          cumulativeChu += Math.max(0, chu);
          chuMapping[day.datetime] = cumulativeChu;
        }
      });
    
      return chuMapping;
  };

  const calculateGDD = (data: WeatherData[], baseTemp: number): Record<string, number> => {
      const gddMapping: Record<string, number> = {};
      let cumulativeGdd = 0;
      data.forEach((day) => {
        const avgTemp = (day.tempmax + day.tempmin) / 2;
        cumulativeGdd += Math.max(0, avgTemp - baseTemp);
        gddMapping[day.datetime] = cumulativeGdd;
      });
    
      return gddMapping;
  };

  return yearlyClimateSummary;
};
