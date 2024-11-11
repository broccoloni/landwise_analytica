'use client';

import { WeatherData } from '@/types/category';

type FrostDates = {
  firstFrost: string | null;
  lastFrost: string | null;
  growingSeasonLength: number | null;
};

export const calculateGrowingSeason = (data: { [key in string]: WeatherData }): FrostDates => {    
  const frostDays = Object.values(data).filter((day) => day.tempmin <= 0);
  const frostDaysBeforeJuly = frostDays.filter((day) => day.month < 8);
  const frostDaysAfterJuly = frostDays.filter((day) => day.month > 8);
    
  const lastFrost = frostDaysBeforeJuly.length
    ? Math.max(...frostDaysBeforeJuly.map((day) => day.dayOfYear))
    : null;
    
  const firstFrost = frostDaysAfterJuly.length
    ? Math.min(...frostDaysAfterJuly.map((day) => day.dayOfYear))
    : null;
    
  let growingSeasonLength: number | null = null;
  if (firstFrost !== null && lastFrost !== null) {
    growingSeasonLength = firstFrost - lastFrost;
  }

  return { firstFrost, lastFrost, growingSeasonLength };
};

export const calculateCornHeatUnits = (data: { [key in string]: WeatherData }): Record<string, number> => {
  const chuMapping: Record<string, number> = {};
  let cumulativeChu = 0;
  Object.values(data).forEach((day) => {
    // Limit maximum temperature for calculation purposes
    const maxTemp = Math.min(day.tempmax, 30); // Cap at 30°C
    const minTemp = day.tempmin; // Minimum should be >= 4.4°C due to check above

    // Corn Heat Unit formula from government website
    const chu = ((1.8 * (minTemp - 4.4)) + (3.33 * (maxTemp - 10)) - (0.084 * Math.pow((maxTemp - 10), 2))) / 2.0;

    cumulativeChu += Math.max(0, chu);
    chuMapping[day.dateStr] = cumulativeChu;
      
    // Ensure CHU is non-negative and store it in the mapping
    if (day.tempmin < 4.4) {
      chuMapping[day.dateStr] = cumulativeChu;
    }
    else {
      cumulativeChu += Math.max(0, chu);
      chuMapping[day.dateStr] = cumulativeChu;
    }
  });

  return chuMapping;
};

export const calculateGDD = (data: { [key in string]: WeatherData }, baseTemp: number): Record<string, number> => {
  const gddMapping: Record<string, number> = {};
  let cumulativeGdd = 0;
  Object.values(data).forEach((day) => {
    const avgTemp = (day.tempmax + day.tempmin) / 2;
    cumulativeGdd += Math.max(0, avgTemp - baseTemp);
    gddMapping[day.dateStr] = cumulativeGdd;
  });

  return gddMapping;
};