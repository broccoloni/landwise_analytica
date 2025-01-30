import { ImageData, DataArray } from '@/types/dataTypes';

const metersPerPixel = 30;

export function calculateSlopeAspectConvexity(
  { sampleData, width, height }: ImageData) 
{
  const slope: DataArray = [];
  const convexity: DataArray = [];
  const aspect: DataArray = [];

  function getElevation(i: number, j: number) {
    const index = i * width + j;
    return sampleData[index] ?? NaN;
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