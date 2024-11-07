const calculateGrowingSeason = (data: WeatherData[]): Record<string, number> => {
  const chuMapping: Record<string, number> = {};
  let cumulativeChu = 0;
  data.forEach((day) => {
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