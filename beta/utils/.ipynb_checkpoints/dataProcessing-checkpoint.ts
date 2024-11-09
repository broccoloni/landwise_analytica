import { calculateGrowingSeason, calculateCornHeatUnits, calculateGDD } from '@/utils/climateUtils';
import { MajorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';
import { cropNames, soilTaxonomyNames, soilTextureNames } from '@/types/valuesToNames';
import { dataToStaticColorUrl, dataToColorScaleUrl } from '@/utils/image';
import { getAvg, getStd, getStats } from '@/utils/stats';
import chroma from 'chroma-js';
import { heatColors, rangeColors, colorSet } from '@/types/colorPalettes';

const scale = 10;

export const processLandUseData = (data) => {
  try {
    const landUseDataDict = data.landUseData;
    
    const newLandUseData = {};
    Object.entries(landUseDataDict).forEach(([year, values]) => {
      const { landUseData, width, height } = values;
      
      const counts: Record<number, number> = {};
      landUseData.forEach((value) => {
        if (value !== null) {
          counts[value] = (counts[value] || 0) + 1;
        }
      });
    
      const totalSum = Object.values(counts).reduce((acc, count) => acc + count, 0);
            
      // Find the MajorCommodityCrop with the highest count
      let maxCount = 0;
      let highestCommodityCrop: MajorCommodityCrop | null = null;
      let highestCommodityKey: number | null = null;
      Object.keys(counts).forEach((key) => {
        const numericKey = parseInt(key);
        const commodityName: string = cropNames[numericKey];
      
        if (majorCommodityCrops.includes(commodityName as MajorCommodityCrop)) {
          const cropCount = counts[numericKey];
        
          // Track the crop with the highest count
          if (cropCount > maxCount) {
            maxCount = cropCount;
            highestCommodityCrop = commodityName as MajorCommodityCrop;
            highestCommodityKey = numericKey;
          }
        }
      });
    
      // Map all major crops with a frequency of less than 3% to the highest commodity crop
      let cropSum = 0;
      const cropTol = 3;
      const cropKeysToConvert = [];
      const majorCommodityCropsGrown: string[] = [];
      Object.keys(counts).forEach((key) => {
        const numericKey = parseInt(key);
        const commodityName: string = cropValuesToNames[numericKey];
      
        if (majorCommodityCrops.includes(commodityName as MajorCommodityCrop)) {
          const cropCount = counts[numericKey];
          const cropPercentage = (cropCount / totalSum) * 100;
        
          if (cropPercentage < cropTol && highestCommodityCrop) {
            // Add the count of this crop to the highest commodity crop and set it to 0
            counts[highestCommodityKey] += cropCount;
            counts[numericKey] = 0;  // Set the low-percentage crop count to zero
            cropKeysToConvert.push(numericKey);
          } else {
            // Track significant major crops grown
            majorCommodityCropsGrown.push(commodityName);
          }
          // Keep track of total majorCommodityCrop area for land use pct
          cropSum += cropCount;
        }
      });

      // Convert pixel values to index in cropNames, and 
      // Convert cropKeysToConvert (pixel values that occur less than 3%) to highest % majorCommodityCrop
      const convertedLandUse = landUseData.map((val) => {
        const index = cropKeysToConvert.includes(val)
          ? Object.keys(cropNames).findIndex((key) => parseInt(key) === highestCommodityKey)
          : Object.keys(cropNames).findIndex((key) => parseInt(key) === val);
      
        return index === -1 ? 0 : index;
      });
        
      // Calculate Land use Pcts
      const usableLandPct = cropSum / totalSum;
      const area = totalSum;

      // Generate image URL and legend
      const colors = chroma.scale(colorSet).colors(Object.keys(cropNames).length);

      const imageUrl = dataToStaticColorUrl(convertedLandUse, width, height, 0, colors, scale);
      const uniqueElements = new Set(convertedLandUse);
      const legend: Record<string, string> = {};

      uniqueElements.forEach((value) => {
        const name = Object.values(cropNames)[value];
        if (name && name !== 'Cloud') {
          legend[name] = colors[value];
        }
      });

      newLandUseData[year] = {
        imageUrl,
        landUseData: convertedLandUse,
        height, 
        width, 
        legend,
        usableLandPct,
        area,
        majorCommodityCropsGrown,
      };
    });

    return newLandUseData;
      
  } catch (error) {
    console.error('Error processing land use data:', error);
  }
};



export const processClimateData = (data) => {
  try {
    const newClimateData = {};
    Object.entries(data.climateData).forEach(([key, values]) => {
      const weatherData = values;
      const { firstFrost, firstFrostStr, lastFrost, lastFrostStr, growingSeasonLength } = calculateGrowingSeason(weatherData);
      const cornHeatUnits = calculateCornHeatUnits(weatherData);
      const GDD0 = calculateGDD(weatherData, 0);
      const GDD5 = calculateGDD(weatherData, 5);
      const GDD10 = calculateGDD(weatherData, 10);
      const GDD15 = calculateGDD(weatherData, 15);
      
      newClimateData[key] = {
        weatherData,
        firstFrost,
        firstFrostStr,
        lastFrost,
        lastFrostStr,
        growingSeasonLength,
        cornHeatUnits,
        GDD0,
        GDD5,
        GDD10,
        GDD15,
      };
    });

    return newClimateData;
  } catch (error) {
    console.error('Error processing climate data:', error);
  }
};

export const processElevationData = (data) => {
  try {
    const width = data.elevationData.width;
    const height = data.elevationData.height;
    const elevation = data.elevationData.elevation;
    const slope = data.elevationData.slope;
    const convexity = data.elevationData.convexity;
    const aspect = data.elevationData.aspect;

    const { min: minElevation, max: maxElevation, avg: avgElevation, std: stdElevation } = getStats(elevation);
    const { min: minSlope, max: maxSlope, avg: avgSlope, std: stdSlope } = getStats(slope);
    const { min: minConvexity, max: maxConvexity, avg: avgConvexity, std: stdConvexity } = getStats(convexity);
      
    const elevationColorScale = chroma.scale(rangeColors).domain([minElevation, maxElevation]);
    const elevationUrl = dataToColorScaleUrl(elevation, width, height, null, elevationColorScale, scale);

    const slopeColorScale = chroma.scale(rangeColors).domain([minSlope, maxSlope]);
    const slopeUrl = dataToColorScaleUrl(slope, width-2, height-2, null, slopeColorScale, scale);

    const convexityColorScale = chroma.scale(rangeColors).domain([minConvexity, maxConvexity]);
    const convexityUrl = dataToColorScaleUrl(convexity, width-2, height-2, null, convexityColorScale, scale);

    return { aspect, width, height,
             elevation, avgElevation, stdElevation, minElevation, maxElevation, 
             slope, avgSlope, stdSlope, minSlope, maxSlope, 
             convexity, avgConvexity, stdConvexity, minConvexity, maxConvexity,
             elevationUrl, slopeUrl, convexityUrl };
      
  } catch (error) {
    console.error('Error processing elevation data:', error);
  }
};

export const processSoilData = (data) => {
  try {
    const taxonomy = data.soilData.taxonomy;
    const width = data.soilData.width;
    const height = data.soilData.height;

    return {
      imageUrl,
      legend,
      taxonomy,
      width,
      height,
    }
      
  } catch (error) {
    console.error('Error processing elevation data:', error);
  }
};

export const processWindData = (data) => {
  try {
    const elevationData = data.elevationData;
    const { aspect, slope } = elevationData;

    // Get most recent year of wind data
    const sortedYears = Object.keys(data.climateData)
            .map(year => Number(year))
            .sort((a, b) => b - a);

    let windData = null;
    for (const year of sortedYears) {
      const yearData = data.climateData[year];
      if (yearData && Object.keys(yearData).length >= 365) {
        windData = {
          windDir: Object.values(yearData).map(data => data.windDir),
          windSpeed: Object.values(yearData).map(data => data.windSpeed),
          gustDir: Object.values(yearData).map(data => data.gustDir),
          gustSpeed: Object.values(yearData).map(data => data.gustSpeed),
        };
        break;
      }
    }
      
    const calculateExposure = (aspectAngle: number, slopeAngle: number, windDirection: number, windSpeed: number) => {
      const angleDiff = Math.abs(aspectAngle - windDirection);
      const angleFactor = Math.cos(angleDiff * (Math.PI / 180));
      return slopeAngle * angleFactor * windSpeed;
    };

    const windExposure: (number|null)[] = [];
    const gustExposure: (number|null)[] = [];
    let minWindExposure = 0;
    let maxWindExposure = 0;
    let minGustExposure = 0;
    let maxGustExposure = 0;

    slope.forEach((slopeValue, idx) => {
      const aspectAngle = aspect[idx];
      if (slopeValue === null || aspectAngle === null) {
        windExposure.push(null);
        gustExposure.push(null);
      } 
      else {
        const slopeAngle = Math.atan(slopeValue) * (180 / Math.PI) / 90;

        const windExposures = windData.windSpeed.map((speed: number, i: number) =>
          calculateExposure(aspectAngle, slopeAngle, windData.windDir[i], speed)
        );
          
        const avgWindExposure = getAvg(windExposures);

        const gustExposures = windData.gustSpeed.map((speed: number, i: number) =>
          calculateExposure(aspectAngle, slopeAngle, windData.gustDir[i], speed)
        );
        const avgGustExposure = getAvg(gustExposures);

        windExposure.push(avgWindExposure);
        gustExposure.push(avgGustExposure);
          
        minWindExposure = Math.min(minWindExposure, avgWindExposure);
        maxWindExposure = Math.max(maxWindExposure, avgWindExposure);
        minGustExposure = Math.min(minGustExposure, avgGustExposure);
        maxGustExposure = Math.max(maxGustExposure, avgGustExposure);
      }
    });

    const avgWindDir = getAvg(windData.windDir);
    const stdWindDir = getStd(windData.windDir);
    const avgGustDir = getAvg(windData.gustDir);
    const stdGustDir = getStd(windData.gustDir);
    const avgWindSpeed = getAvg(windData.windSpeed);
    const stdWindSpeed = getStd(windData.windSpeed);
    const avgGustSpeed = getAvg(windData.gustSpeed);
    const stdGustSpeed = getStd(windData.gustSpeed);

    const windColorScale = chroma.scale(rangeColors).domain([minWindExposure, maxWindExposure]);
    const windExposureUrl = dataToColorScaleUrl(windExposure, 
                                                elevationData.width-2, 
                                                elevationData.height-2, 
                                                null, 
                                                windColorScale,
                                                scale);

    const gustColorScale = chroma.scale(rangeColors).domain([minGustExposure, maxGustExposure]);
    const gustExposureUrl = dataToColorScaleUrl(gustExposure, 
                                                elevationData.width-2, 
                                                elevationData.height-2, 
                                                null, 
                                                gustColorScale,
                                                scale);

    return {
      windExposureUrl,
      minWindExposure,
      maxWindExposure,
      avgWindSpeed,
      stdWindSpeed,
      avgWindDir,
      stdWindDir,
      gustExposureUrl,
      minGustExposure,
      maxGustExposure,
      avgGustSpeed,
      stdGustSpeed,
      avgGustDir,
      stdGustDir
    };
      
  } catch (error) {
    console.error('Error processing wind data:', error);
  }
};