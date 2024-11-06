import ee from '@google/earthengine';
import { evaluateDictionary } from '@/utils/earthEngineUtils';

interface FetchLandUseDataOptions {
  years: number[];
  geometry: ee.Geometry;
}

export async function fetchLandUseData({ years, geometry }: FetchLandUseDataOptions) {
  const results: Record<number, { [key: number]: any }> = {};

  for (const year of years) {
    try {
      // Retrieve the historical land use data for the given year
      const AAFCImage = ee.ImageCollection('AAFC/ACI')
        .filterDate(`${year}-01-01`, `${year}-12-31`)
        .first();

      if (!AAFCImage) {
        console.warn(`No data found for the year ${year}`);
        continue;
      }

      const sampleData = AAFCImage.sampleRectangle({ region: geometry });
        
      // Use the reusable function to process the image
      const landUseData = await evaluateDictionary(sampleData);
      console.log(landUseData);
        
      results[year] = landUseData;
    } catch (error) {
      console.error(`Failed to fetch data for year ${year}:`, error.message);
    }
  }

  return results;
}



      // Retrieve the historical land use data for the given year
      // const AAFCImage = ee.ImageCollection('AAFC/ACI')
      //   .filterDate(`${year}-01-01`, `${year}-12-31`)
      //   .first();
