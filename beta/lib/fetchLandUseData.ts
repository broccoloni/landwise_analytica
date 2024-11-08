import ee from '@google/earthengine';
import { evaluateDictionary } from '@/utils/earthEngineUtils';

export async function fetchLandUseData( years: number[], geometry: ee.Geometry) {
  const results: Record<number, { [key: number]: any }> = {};

  for (const yr of years) {
    try {
      const year = parseInt(yr)
      // Retrieve the historical land use data for the given year
      const AAFCImage = ee.ImageCollection('AAFC/ACI')
        .filterDate(`${year}-01-01`, `${year+1}-01-01`)
        .first();

      if (!AAFCImage) {
        console.warn(`No data found for the year ${year}`);
        continue;
      }


      const regionMask = ee.Image(1).clip(geometry);
      const maskedImage = AAFCImage.updateMask(regionMask);

      // Need to reproject the scale since the vertical and horizontal
      // resolution of the image is not equal, leading to a slight tilt
      // when displaying the images on the map with square pixels
      const reprojectedImage = maskedImage.reproject({
        crs: 'EPSG:4326',
        scale: 30,
      });
        
      const sampleData = reprojectedImage.sampleRectangle({ region: geometry, defaultValue: 0 });
      const landUseDataObj = await evaluateDictionary(sampleData);
    
      const landUseDataArray = landUseDataObj.properties.landcover;
      const height = landUseDataArray.length;
      const width = landUseDataArray[0] ? landUseDataArray[0].length : 0;
      const landUseData = landUseDataArray.flat();

      // Could also potentially include:
      // .properties.landcover_class_names, .properties.landcover_class_palette, .properties.landcover_class_values, 
      results[year] = { landUseData, height, width };
    } catch (error) {
      console.error(`Failed to fetch land use data:`, error.message);
    }
  }

  return results;
}
