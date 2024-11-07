import ee from '@google/earthengine';
import { evaluateDictionary } from '@/utils/earthEngineUtils';

export async function fetchLandUseData( years: number[], geometry: ee.Geometry) {
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


      const regionMask = ee.Image(1).clip(geometry);
      const maskedImage = AAFCImage.updateMask(regionMask);
      const sampleData = maskedImage.sampleRectangle({ region: geometry, defaultValue: 0 });
      const landUseDataObj = await evaluateDictionary(sampleData);
    
      const landUseDataArray = landUseDataObj.properties.landcover;
      const height = landUseDataArray.length;
      const width = landUseDataArray[0] ? landUseDataArray[0].length : 0;
      const landUseData = landUseDataArray.flat().map(value => (value === 0 ? null : value));

      // Could also potentially include:
      // .properties.landcover_class_names, .properties.landcover_class_palette, .properties.landcover_class_values, 
      results[year] = { landUseData, height, width };
    } catch (error) {
      console.error(`Failed to fetch data for year ${year}:`, error.message);
    }
  }

  return results;
}
