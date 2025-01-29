import ee from '@google/earthengine';
import { fetchImage } from '@/utils/earthEngineUtils';

export async function fetchSoilData(geometry: ee.Geometry) {
  try {
    console.log("Fetching soil data");

    // Soil Classifications
    // taxonomyData: { grtgroup: { sampleData, width, height } }
    // textureData: { b0: { sampleData, width, height }, b10: { sampleData, width, height }, b30: { sampleData, width, height } }
    const taxonomyData = await fetchImage('OpenLandMap/SOL/SOL_GRTGROUP_USDA-SOILTAX_C/v01', 'grtgroup', geometry);
    const textureData= await fetchImage('OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02', ['b0','b10','b30'], geometry);

    // Soil Contents
    const waterData= await fetchImage('OpenLandMap/SOL/SOL_WATERCONTENT-33KPA_USDA-4B1C_M/v01', ['b0','b10','b30'], geometry);
    const sandData= await fetchImage('OpenLandMap/SOL/SOL_SAND-WFRACTION_USDA-3A1A1A_M/v02', ['b0','b10','b30'], geometry);
    const clayData= await fetchImage('OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02', ['b0','b10','b30'], geometry);
    const carbonData= await fetchImage('OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02', ['b0','b10','b30'], geometry);

    // Soil Attributes
    const phData= await fetchImage('OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02', ['b0','b10','b30'], geometry);
    const densityData= await fetchImage('OpenLandMap/SOL/SOL_BULKDENS-FINEEARTH_USDA-4A1H_M/v02', ['b0','b10','b30'], geometry);

      
    return { 
      taxonomyData,
      textureData,
      waterData,
      sandData,
      clayData,
      carbonData,
      phData,
      densityData,
    };
        
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch soil data:`, error.message);
    } else {
      console.error('An unexpected error occurred');
    }
  }
}
