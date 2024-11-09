import ee from '@google/earthengine';
import { fetchImage } from '@/utils/earthEngineUtils';
import { calculateSlopeAspectConvexity } from '@/utils/elevationUtils';

export async function fetchElevationData(geometry: ee.Geometry) {
  try {
    // elevationData: { 'elevation: { sampleData, width, height } }
    const elevationDict = await fetchImage('NASA/NASADEM_HGT/001', 'elevation', geometry);
    const elevationData = elevationDict.elevation;
      
    const { slope, aspect, convexity } = calculateSlopeAspectConvexity(elevationData);
    return { elevationData, slope, aspect, convexity };
      
  } catch (error) {
    console.error('Failed to fetch elevation data:', error.message);
    throw error;
  }
}
