import ee from '@google/earthengine';
import { fetchImage } from '@/utils/earthEngineUtils';
import { calculateSlopeAspectConvexity } from '@/utils/elevationUtils';

export async function fetchElevationData(geometry: ee.Geometry) {
  try {
    const { sampleData: elevation, width, height } = await fetchImage('NASA/NASADEM_HGT/001', 'elevation', geometry);
    const { slope, aspect, convexity } = calculateSlopeAspectConvexity(elevation, width, height);
    return { elevation, width, height, slope, aspect, convexity };
      
  } catch (error) {
    console.error('Failed to fetch elevation data:', error.message);
    throw error;
  }
}
