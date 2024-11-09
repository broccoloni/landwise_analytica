import { calculateGrowingSeason, calculateCornHeatUnits, calculateGDD } from '@/utils/climateUtils';
import { MajorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';
import { cropNames, soilTaxonomyNames, soilTextureNames } from '@/types/valuesToNames';
import { 
  dataToStaticColorUrl, 
  dataToColorScaleUrl, 
  getImageAndStats, 
  getBandImagesAndStats, 
  getImageLegendUnique, 
  getBandImagesLegendsUnique 
} from '@/utils/image';

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
        const commodityName: string = cropNames[numericKey];
      
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
      const convertedLandUse = landUseData.map((val) => cropKeysToConvert.includes(val) ? highestCommodityKey : val);
        
      // Calculate Land use Pcts
      const usableLandPct = cropSum / totalSum;
      const area = totalSum;

      const landUseImageData = getImageLegendUnique({ sampleData: convertedLandUse, width, height }, cropNames, scale);
      const { imageUrl, legend, uniqueElements } = landUseImageData;

        
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
    const width = data.elevationData.elevationData.width;
    const height = data.elevationData.elevationData.height;
    const elevation = getImageAndStats(data.elevationData.elevationData, scale);

    const slopeData = { sampleData: data.elevationData.slope, width: width-2, height: height-2 };
    const slope =  getImageAndStats(slopeData, scale);
      
    const convexityData = { sampleData: data.elevationData.convexity, width: width-2, height: height-2 };
    const convexity = getImageAndStats(convexityData, scale);
      
    return { elevation, slope, convexity };
      
  } catch (error) {
    console.error('Error processing elevation data:', error);
  }
};

export const processSoilData = (data) => {
  try {
    // Soil Classifications
    const taxonomy = getImageLegendUnique(data.soilData.taxonomyData.grtgroup, soilTaxonomyNames, scale);
    const texture = getBandImagesLegendsUnique(data.soilData.textureData, soilTextureNames, scale);

    // Soil Contents
    const water = getBandImagesAndStats(data.soilData.waterData, scale);
    const sand = getBandImagesAndStats(data.soilData.sandData, scale);
    const clay = getBandImagesAndStats(data.soilData.clayData, scale);
    const carbon = getBandImagesAndStats(data.soilData.carbonData, scale);

    // Soil Attributes
    const ph = getBandImagesAndStats(data.soilData.phData, scale);
    const density = getBandImagesAndStats(data.soilData.densityData, scale);

    return {
      taxonomy,
      texture,
      water,
      sand,
      clay,
      carbon,
      ph,
      density,
    }
      
  } catch (error) {
    console.error('Error processing soil data:', error);
  }
};

export const processWindData = (data) => {
  try {
    const { aspect, slope } = data.elevationData;
    const width = data.elevationData.elevationData.width-2;
    const height = data.elevationData.elevationData.height-2;
      
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
                                                width,
                                                height,
                                                null, 
                                                windColorScale,
                                                scale);

    const gustColorScale = chroma.scale(rangeColors).domain([minGustExposure, maxGustExposure]);
    const gustExposureUrl = dataToColorScaleUrl(gustExposure, 
                                                width, 
                                                height,
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