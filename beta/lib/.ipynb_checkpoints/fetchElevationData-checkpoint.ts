import ee from '@google/earthengine';
import { evaluateDictionary } from '@/utils/earthEngineUtils';
import { getHeatMapUrl } from '@/utils/imageUrl';
import { getStats } from '@/utils/stats';
import chroma from 'chroma-js';

import { printType } from '@/utils/debug';

const scaleFactor=10;
const metersPerPixel = 30;
const heatmapColors = ['#6A0DAD', '#228B22', '#FFD700', '#8B0000'];

export async function fetchElevationData(geometry: ee.Geometry) {
  try {
    const elevationImage = ee.Image('NASA/NASADEM_HGT/001').select('elevation');

    if (!elevationImage) {
      throw new Error('No data found for elevation image');
    }
    const regionMask = ee.Image(1).clip(geometry);
    const maskedImage = elevationImage.updateMask(regionMask);
    const sampleData = maskedImage.sampleRectangle({ region: geometry, defaultValue: 0 });
    const elevationDataObj = await evaluateDictionary(sampleData);

    const elevationDataArray = elevationDataObj.properties.elevation;
    const height = elevationDataArray.length;
    const width = elevationDataArray[0] ? elevationDataArray[0].length : 0;
    const elevation = elevationDataArray.flat().map(value => (value === 0 ? null : value));
    const { slope, convexity, aspect } = calculateSlopeAspectConvexity(elevation, width, height);
      
    const { min: minElevation, max: maxElevation, avg: avgElevation, std: stdElevation } = getStats(elevation);
    const { min: minSlope, max: maxSlope, avg: avgSlope, std: stdSlope } = getStats(slope);
    const { min: minConvexity, max: maxConvexity, avg: avgConvexity, std: stdConvexity } = getStats(convexity);

    // NOTE: getHeatMapUrl uses document and is therefore only usable on the client side. 
    // It is possible to run canvas operations on the server side, but this would lead to
    // more computation for us and therefore cost more for us running servers
    // const elevationColorScale = chroma.scale(heatmapColors).domain([minElevation, maxElevation]);
    // const elevationUrl = await getHeatMapUrl(elevation, 
    //                                          width, 
    //                                          height, 
    //                                          null, 
    //                                          elevationColorScale,
    //                                          scaleFactor);

    // const slopeColorScale = chroma.scale(heatmapColors).domain([minSlope, maxSlope]);
    // const slopeUrl = await getHeatMapUrl(slope, 
    //                                      width-2, 
    //                                      height-2, 
    //                                      null, 
    //                                      slopeColorScale,
    //                                      scaleFactor);

    // const convexityColorScale = chroma.scale(heatmapColors).domain([minConvexity, maxConvexity]);
    // const convexityUrl = await getHeatMapUrl(convexity, 
    //                                          width-2, 
    //                                          height-2, 
    //                                          null, 
    //                                          convexityColorScale,
    //                                          scaleFactor);

    // returning raw slope and aspect data, as well as width and heigh as they are needed with wind speeds 
    // and directions to calculate wind exposure risk, which then gets converted to an image
    return { aspect, width, height,
             elevation, avgElevation, stdElevation, minElevation, maxElevation, 
             slope, avgSlope, stdSlope, minSlope, maxSlope, 
             convexity, avgConvexity, stdConvexity, minConvexity, maxConvexity };

  } catch (error) {
    console.error('Failed to fetch elevation data:', error.message);
    throw error;
  }
}

function calculateSlopeAspectConvexity(elevationData: (number|null)[], width: number, height: number) {
  const slope: (number | null)[] = [];
  const convexity: (number | null)[] = [];
  const aspect: (number | null)[] = [];

  function getElevation(i: number, j: number) {
    const index = i * width + j;
    return elevationData[index] ?? NaN;
  }

  for (let i = 1; i < height - 1; i++) {
    for (let j = 1; j < width - 1; j++) {
      const p = getElevation(i, j);
      const pl = getElevation(i, j - 1);
      const pr = getElevation(i, j + 1);
      const pu = getElevation(i - 1, j);
      const pd = getElevation(i + 1, j);

      // Check if any of the elevations are null
      if ([p, pl, pr, pu, pd].some(val => val === null || isNaN(val))) {
        slope.push(null);
        convexity.push(null);
        aspect.push(null);
      }
      else {
        const slopeX = (pr - pl) / (2 * metersPerPixel);
        const slopeY = (pd - pu) / (2 * metersPerPixel);
        const overallSlope = Math.sqrt(Math.pow(slopeX, 2) + Math.pow(slopeY, 2));
        
        const secondDerivativeX = (pr - 2 * p + pl) / Math.pow(metersPerPixel, 2);
        const secondDerivativeY = (pd - 2 * p + pu) / Math.pow(metersPerPixel, 2);
        const xyconvexity = secondDerivativeX + secondDerivativeY;
        
        const slopeAspect = Math.atan2(slopeY, slopeX) * (180 / Math.PI);
        const normalizedAspect = slopeAspect >= 0 ? slopeAspect : slopeAspect + 360; // 0 - 360 degrees
        
        if (!isNaN(overallSlope)) {
          slope.push(overallSlope);
          convexity.push(xyconvexity);
          aspect.push(normalizedAspect);
        } else {
          console.warn("Invalid elevation value at", { i, j, p, pl, pr, pu, pd, slopeX, slopeY, overallSlope, width, height });
          slope.push(null);
          convexity.push(null);
          aspect.push(null);
        }
      }
    }
  }

  return { slope, convexity, aspect };
}
