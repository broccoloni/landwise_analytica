import ee from '@google/earthengine';
import { evaluateDictionary } from '@/utils/earthEngineUtils';

export async function fetchElevationData(geometry: ee.Geometry) {
  try {
    const elevationImage = ee.Image('NASA/NASADEM_HGT/001').select('elevation');

    if (!elevationImage) {
      throw new Error('No data found for elevation image');
    }
    const regionMask = ee.Image(1).clip(geometry);
    const maskedImage = elevationImage.updateMask(regionMask);
    const sampleData = maskedImage.sampleRectangle({ region: geometry, defaultValue: null });
    const elevationData = await evaluateDictionary(sampleData);
    console.log(elevationData);

    return elevationData;

  } catch (error) {
    console.error('Failed to fetch elevation data:', error.message);
    throw error;
  }
}
