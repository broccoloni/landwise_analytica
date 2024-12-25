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
import { dayNumToMonthDay } from '@/utils/dates';
const scale = 10;

export const processLandUseData = (landUseDataDict) => {
  try {
    
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

export const processGrowingSeasonData = (climateData) => {
  try {
    const x = Object.keys(climateData); // years of data
    const y0 = []; //last frost day ints for each year
    const y1 = []; //first frost day ints for each year
    const growingSeasons = [];
    const desc = [];
      
    Object.entries(climateData).forEach(([year, weatherData]) => {
      const { firstFrost, lastFrost, growingSeasonLength } = calculateGrowingSeason(weatherData);
      y0.push(lastFrost);
      y1.push(firstFrost);
      growingSeasons.push(growingSeasonLength);
      desc.push(`Year: ${year}<br>Growing Season Length: ${growingSeasonLength} days<br>Last Frost Date: ${dayNumToMonthDay(lastFrost, year)}<br>First Frost Date: ${dayNumToMonthDay(firstFrost, year)}`);
    });

    const firstFrosts = getStats(y1);
    const lastFrosts = getStats(y0);
    const seasons = getStats(growingSeasons);
      
    return {
      x,
      y0,
      y1,
      desc,
      firstFrosts,
      lastFrosts,
      seasons,
    };
    
  } catch (error) {
    console.error('Error processing growing season data:', error);
  }
};

export const processHeatUnitData = (climateData) => {
  try {
    const years = Object.keys(climateData);
    const chu = { data: {} };
    const gdd0 = { data: {} };
    const gdd5 = { data: {} };
    const gdd10 = { data: {} };
    const gdd15 = { data: {} };

    const endOfYearChu = [];
    const endOfYearGdd0 = [];
    const endOfYearGdd5 = [];
    const endOfYearGdd10 = [];
    const endOfYearGdd15 = [];
      
    Object.entries(climateData).forEach(([year, weatherData]) => {
      chu.data[year] = calculateCornHeatUnits(weatherData);
      gdd0.data[year] = calculateGDD(weatherData, 0);
      gdd5.data[year] = calculateGDD(weatherData, 5);
      gdd10.data[year] = calculateGDD(weatherData, 10);
      gdd15.data[year] = calculateGDD(weatherData, 15);

      endOfYearChu.push(Object.values(chu.data[year]).slice(-1)[0]);
      endOfYearGdd0.push(Object.values(gdd0.data[year]).slice(-1)[0]);
      endOfYearGdd5.push(Object.values(gdd5.data[year]).slice(-1)[0]);
      endOfYearGdd10.push(Object.values(gdd10.data[year]).slice(-1)[0]);
      endOfYearGdd15.push(Object.values(gdd15.data[year]).slice(-1)[0]);
    });
      
    return {
      years,
      chu: { ...chu, ...getStats(endOfYearChu) },
      gdd0: { ...gdd0, ...getStats(endOfYearGdd0) },
      gdd5: { ...gdd5, ...getStats(endOfYearGdd5) },
      gdd10: { ...gdd10, ...getStats(endOfYearGdd10) },
      gdd15: { ...gdd15, ...getStats(endOfYearGdd15) },
    };

  } catch (error) {
    console.error('Error processing heat unit data:', error);
  }
};

export const processClimateData = (climateData) => {
  try {
    const newClimateData = {};
    Object.entries(climateData).forEach(([year, weatherData]) => {
      const precip = Object.values(weatherData).map((dayData) => dayData.precip);
      const temp = Object.values(weatherData).map((dayData) => dayData.temp);
      const dew = Object.values(weatherData).map((dayData) => dayData.dew);

      newClimateData[year] = {
        precip,
        temp,
        dew,
      };
    });

    return newClimateData;
  } catch (error) {
    console.error('Error processing climate data:', error);
  }
};

export const processElevationData = (elevationData) => {
  try {
    const width = elevationData.elevationData.width;
    const height = elevationData.elevationData.height;
    const elevation = getImageAndStats(elevationData.elevationData, scale);

    const slopeData = { sampleData: elevationData.slope, width: width-2, height: height-2 };
    const slope =  getImageAndStats(slopeData, scale);
      
    const convexityData = { sampleData: elevationData.convexity, width: width-2, height: height-2 };
    const convexity = getImageAndStats(convexityData, scale);
      
    return { elevation, slope, convexity };
      
  } catch (error) {
    console.error('Error processing elevation data:', error);
  }
};

export const processSoilData = (soilData) => {
  try {
    // Soil Classifications
    const taxonomy = getImageLegendUnique(soilData.taxonomyData.grtgroup, soilTaxonomyNames, scale);
    const texture = getBandImagesLegendsUnique(soilData.textureData, soilTextureNames, scale);

    // Soil Contents
    const water = getBandImagesAndStats(soilData.waterData, scale);
    const sand = getBandImagesAndStats(soilData.sandData, scale);
    const clay = getBandImagesAndStats(soilData.clayData, scale);
    const carbon = getBandImagesAndStats(soilData.carbonData, scale);

    // Soil Attributes
    const ph = getBandImagesAndStats(soilData.phData, scale);
    const density = getBandImagesAndStats(soilData.densityData, scale);

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

export const processWindData = (elevationData, climateData) => {
  try {
    const { aspect, slope } = elevationData;
    const width = elevationData.elevationData.width-2;
    const height = elevationData.elevationData.height-2;
      
    // Get most recent year of wind data
    const sortedYears = Object.keys(climateData)
            .map(year => Number(year))
            .sort((a, b) => b - a);

    let windData = null;
    for (const year of sortedYears) {
      const yearData = climateData[year];
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
      }
    });

    const wind = getImageAndStats({ sampleData: windExposure, width, height }, scale);
    const windDirStats = getStats(windData.windDir);

    const gust = getImageAndStats({ sampleData: gustExposure, width, height }, scale);
    const gustDirStats = getStats(windData.gustDir);

    return {
      wind: { ...wind, avgDir: windDirStats.avg, stdDir: windDirStats.std },
      gust: { ...gust, avgDir: gustDirStats.avg, stdDir: gustDirStats.std },
    };  
      
  } catch (error) {
    console.error('Error processing wind data:', error);
  }
};