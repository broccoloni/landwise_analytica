import ee from '@google/earthengine';
import { evaluateImage } from '@/utils/earthEngineUtils';
import { norm2 } from '@/utils/stats';
import { intsToDayOfYear } from '@/utils/dates';

export async function fetchClimateData(years, geometry) {
  const results = {};

  const selectedBands = [
    'dewpoint_temperature_2m',
    'temperature_2m',
    'temperature_2m_min',
    'temperature_2m_max',
    'total_precipitation_sum',
    'u_component_of_wind_10m',
    'u_component_of_wind_10m_max',
    'v_component_of_wind_10m',
    'v_component_of_wind_10m_max'
  ];

  for (const yr of years) {
    console.log("Fetching climate data for", yr);
    try {
      const year = parseInt(yr);
      const climateImage = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR')
        .filterDate(ee.Date(`${year}-01-01`), ee.Date(`${year+1}-01-01`));
        
      if (!climateImage) {
        console.warn(`No climate data found for the year ${year}`);
        continue;
      }
        
      const climateBands = climateImage.select(selectedBands).toBands();
      const climateValues = climateBands.reduceRegion({
        reducer: ee.Reducer.first(),
        geometry: geometry.centroid(),
        scale: 30,
      });

      const separatedClimateDict = await evaluateImage(climateValues);

      const climateDict = {};
      Object.entries(separatedClimateDict).forEach(([key, value]) => {
        const year = key.slice(0, 4);
        const month = key.slice(4, 6);
        const day = key.slice(6, 8);
        const newKey = `${month}-${day}`;
        const attr = key.slice(9);

        if (!(newKey in climateDict)) {
          climateDict[newKey] = { year, month, day };
        }
        climateDict[newKey][attr] = value;
      });
        
      const climateData = {};
      Object.entries(climateDict).forEach(([key, values]) => { 
        const u_wind = values.u_component_of_wind_10m;
        const v_wind = values.v_component_of_wind_10m;
        const windSpeed = norm2([u_wind, v_wind]);

        const windAngle = 90 - Math.atan2(u_wind, v_wind) * (180 / Math.PI);
        const windDir = windAngle < 0 ? windAngle + 360 : windAngle;

        const u_gust = values.u_component_of_wind_10m_max;
        const v_gust = values.v_component_of_wind_10m_max;
        const gustSpeed = norm2([u_gust, v_gust]);

        const gustAngle = 90 - Math.atan2(u_gust, v_gust) * (180 / Math.PI);
        const gustDir = gustAngle < 0 ? gustAngle + 360 : gustAngle;

        const year = parseInt(values.year);
        const month = parseInt(values.month);
        const day = parseInt(values.day);

        // Convert temperatures from kelvin to celsius, precip from m to mm
        climateData[key] = {
          year,
          month,
          day,
          dayOfYear: intsToDayOfYear(year, month, day),
          dateStr: `${values.year}-${values.month}-${values.day}`,
          dew: values.dewpoint_temperature_2m - 273.15,
          temp: values.temperature_2m - 273.15,
          tempmin: values.temperature_2m_min - 273.15,
          tempmax: values.temperature_2m_max - 273.15,
          precip: values.total_precipitation_sum * 1000,
          windSpeed,
          windDir,
          gustSpeed,
          gustDir,
          humidity: 0,
        };
      });

      results[year] = climateData;

    } catch (error) {
      console.error(`Failed to fetch data for year ${year}:`, error.message);
    }
  }

  return results;
}
