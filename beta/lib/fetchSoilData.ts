import ee from '@google/earthengine';
import { fetchImage } from '@/utils/earthEngineUtils';

export async function fetchSoilData(geometry: ee.Geometry) {
  try {
    // Only need the width and height from the first one
    const { sampleData: taxonomy, width, height } = await fetchImage('OpenLandMap/SOL/SOL_GRTGROUP_USDA-SOILTAX_C/v01', 'grtgroup', geometry);
    const { sampleData: texture0 } = await fetchImage('OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02', 'b0', geometry);
    const { sampleData: texture10 } = await fetchImage('OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02', 'b10', geometry);
    const { sampleData: texture30 } = await fetchImage('OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02', 'b30', geometry);

    return { 
      width,
      height,
      taxonomyData: {
        taxonomy, 
      },
      textureData0: {
        texture0,
      },
      textureData10: {
        texture10,
      },
      textureData30: {
        texture30,
      },
    };
        
  } catch (error) {
    console.error('Failed to fetch elevation data:', error.message);
    throw error;
  }
}
