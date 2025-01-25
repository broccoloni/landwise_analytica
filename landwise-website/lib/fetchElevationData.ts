import ee from '@google/earthengine';
import { fetchImage } from '@/utils/earthEngineUtils';
import { calculateSlopeAspectConvexity } from '@/utils/elevationUtils';
import { Data } from '@/types/dataTypes';

export async function fetchElevationData(geometry: ee.Geometry) {
  try {
    console.log("Fetching elevation data");

    // elevationData: { 'elevation: { sampleData, width, height } }
    const elevationDict = await fetchImage('NASA/NASADEM_HGT/001', 'elevation', geometry);
    
    if (!elevationDict) {
      throw new Error('Failed to fetch elevation data: elevationDict is undefined');
    }
      
    const elevationData = elevationDict.elevation as Data;
      
    const { slope, aspect, convexity } = calculateSlopeAspectConvexity(elevationData);
    return { elevationData, slope, aspect, convexity };
      
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch elevation data:`, error.message);
    } else {
      console.error('An unexpected error occurred');
    }
  }
}
