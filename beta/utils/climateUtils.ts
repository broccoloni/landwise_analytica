import { WeatherData } from '@/types/category';

type FrostDates = {
  firstFrost: string | null;
  lastFrost: string | null;
  growingSeasonLength: number | null;
};

export const calculateGrowingSeason = (data: { [key in string]: WeatherData }): FrostDates => {
  const weatherValues = Object.values(data);
  const frostDays = weatherValues.filter((day) => day.tempmin <= 0);
  const julyFirst = new Date(`${weatherValues[0].datetime.substring(0, 4)}-07-01`);

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

export const calculateCornHeatUnits = (data: { [key in string]: WeatherData }): Record<string, number> => {
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

export const calculateGDD = (data: { [key in string]: WeatherData }, baseTemp: number): Record<string, number> => {
  const gddMapping: Record<string, number> = {};
  let cumulativeGdd = 0;
  data.forEach((day) => {
    const avgTemp = (day.tempmax + day.tempmin) / 2;
    cumulativeGdd += Math.max(0, avgTemp - baseTemp);
    gddMapping[day.datetime] = cumulativeGdd;
  });

  return gddMapping;
};