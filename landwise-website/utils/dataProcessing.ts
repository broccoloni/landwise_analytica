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
import { LandUseData, ElevationData, WeatherData, ClimateData } from '@/types/category';
import { Data, DataArray, ImageAndLegend, ImageAndStats, PerformanceData } from '@/types/dataTypes';

import { getAvg, getStd, getStats } from '@/utils/stats';
import chroma from 'chroma-js';
import { heatColors, rangeColors, colorSet } from '@/types/colorPalettes';
import { dayNumToMonthDay } from '@/utils/dates';
const scale = 10;

export const processLandUseData = (landUseDataDict: Record<number,Data>) => {
  try {
    
    const newLandUseData: Record<number, LandUseData> = {};
    Object.entries(landUseDataDict).forEach(([year, values]) => {
      const numericYear = Number(year);
      const { sampleData: landUseData, width, height } = values;

      if (!landUseData) {
        throw new Error(`land use data not found for year ${year}`);
      }
        
      const counts: Record<number, number> = {};
      landUseData.forEach((value) => {
        if (value !== null) {
          counts[value] = (counts[value] || 0) + 1;
        }
      });
    
      const totalSum = Object.values(counts).reduce((acc, count) => acc + count, 0);
            
      // Find the MajorCommodityCrop with the highest count
      let maxCount = 0;
      let highestCommodityCrop: MajorCommodityCrop = majorCommodityCrops[0];
      let highestCommodityKey: number = 0;
        
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
      const cropKeysToConvert: number[] = [];
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
      const convertedLandUse: DataArray = landUseData.map((val: (number|null)) => {
        if (val === null) return val;
        if (cropKeysToConvert.includes(val)) return highestCommodityKey ?? null;
        return val
      });
        
      // Calculate Land use Pcts
      const usableLandPct = cropSum / totalSum;
      const area = totalSum;

      const { imageUrl, legend, uniqueElements } = getImageLegendUnique(
        { sampleData: convertedLandUse, width, height } as Data, 
        cropNames, 
        scale
      );        
        
      newLandUseData[numericYear] = {
        imageUrl,
        legend,
        cropArea: Math.round(area * usableLandPct),
        area,
        counts
      };
    });

    return newLandUseData;
      
  } catch (error) {
    console.error('Error processing land use data:', error);
  }
};

export const processGrowingSeasonData = (climateData: Record<number, ClimateData>) => {
  try {
    const x = Object.keys(climateData); // years of data
    const lastFrostDays: number[] = [];
    const firstFrostDays: number[] = [];
    const growingSeasons: number[] = [];
    const desc: string[] = [];
      
    Object.entries(climateData).forEach(([year, climateData]) => {
      const weatherData = climateData.weatherData;

      if (!weatherData) {
        throw new Error('Weather data not found');
      }
    
      const { firstFrost, lastFrost, growingSeasonLength } = calculateGrowingSeason(weatherData);
      const lastFrostDate = dayNumToMonthDay(lastFrost, Number(year));
      const firstFrostDate = dayNumToMonthDay(firstFrost, Number(year));

      lastFrostDays.push(lastFrost);
      firstFrostDays.push(firstFrost);
      growingSeasons.push(growingSeasonLength);

      desc.push(`Year: ${year}<br>Growing Season Length: ${growingSeasonLength} days<br>Last Frost Date: ${lastFrostDate}<br>First Frost Date: ${firstFrostDate}`);
    });
      
    const firstFrosts = getStats(firstFrostDays);
    const lastFrosts = getStats(lastFrostDays);
    const seasons = getStats(growingSeasons);
      
    return {
      x,
      y0: lastFrostDays,
      y1: growingSeasons,
      desc,
      firstFrosts,
      lastFrosts,
      seasons,
    };
    
  } catch (error) {
    console.error('Error processing growing season data:', error);
  }
};

export const processHeatUnitData = (climateData: Record<number, ClimateData>) => {
  try {
    const years = Object.keys(climateData);
    const chuData: Record<number, Record<string, number>> = {};
    const gdd0Data: Record<number, Record<string, number>> = {};
    const gdd5Data: Record<number, Record<string, number>> = {};
    const gdd10Data: Record<number, Record<string, number>> = {};
    const gdd15Data: Record<number, Record<string, number>> = {};

    const endOfYearChu: number[] = [];
    const endOfYearGdd0: number[] = [];
    const endOfYearGdd5: number[] = [];
    const endOfYearGdd10: number[] = [];
    const endOfYearGdd15: number[] = [];
      
    Object.entries(climateData).forEach(([year, climateData]) => {
      const weatherData = climateData.weatherData;
      if (!weatherData) {
        throw new Error('Weather data not found');
      }

      const numericYear = Number(year);
        
      chuData[numericYear] = calculateCornHeatUnits(weatherData);
      gdd0Data[numericYear] = calculateGDD(weatherData, 0);
      gdd5Data[numericYear] = calculateGDD(weatherData, 5);
      gdd10Data[numericYear] = calculateGDD(weatherData, 10);
      gdd15Data[numericYear] = calculateGDD(weatherData, 15);

      endOfYearChu.push(Object.values(chuData[numericYear]).slice(-1)[0]);
      endOfYearGdd0.push(Object.values(gdd0Data[numericYear]).slice(-1)[0]);
      endOfYearGdd5.push(Object.values(gdd5Data[numericYear]).slice(-1)[0]);
      endOfYearGdd10.push(Object.values(gdd10Data[numericYear]).slice(-1)[0]);
      endOfYearGdd15.push(Object.values(gdd15Data[numericYear]).slice(-1)[0]);
    });
      
    return {
      years,
      chu: { data: chuData, ...getStats(endOfYearChu) },
      gdd0: { data: gdd0Data, ...getStats(endOfYearGdd0) },
      gdd5: { data: gdd5Data, ...getStats(endOfYearGdd5) },
      gdd10: { data: gdd10Data, ...getStats(endOfYearGdd10) },
      gdd15: { data: gdd15Data, ...getStats(endOfYearGdd15) },
    };

  } catch (error) {
    console.error('Error processing heat unit data:', error);
  }
};

export const processClimateData = (climateData: Record<number, ClimateData>) => {
  try {
    const newClimateData: Record<number, { precip: number[], temp: number[], dew: number[] }> = {};
    Object.entries(climateData).forEach(([year, climateData]) => {
      const weatherData = climateData.weatherData;
      if (!weatherData) {
        throw new Error('Weather data not found');
      }
      const precip = Object.values(weatherData).map((dayData) => dayData.precip);
      const temp = Object.values(weatherData).map((dayData) => dayData.temp);
      const dew = Object.values(weatherData).map((dayData) => dayData.dew);
        
      const numericYear = Number(year);

      newClimateData[numericYear] = {
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

export const processElevationData = (elevationData: { elevationData: Data, slope: DataArray, aspect: DataArray, convexity: DataArray }) => {
  try {
    const width = elevationData.elevationData.width;
    const height = elevationData.elevationData.height;
    const elevation = getImageAndStats(elevationData.elevationData, scale);

    const slopeData = { sampleData: elevationData.slope, width: width-2, height: height-2 } as Data;
    const slope =  getImageAndStats(slopeData, scale);
      
    const convexityData = { sampleData: elevationData.convexity, width: width-2, height: height-2 } as Data;
    const convexity = getImageAndStats(convexityData, scale);
      
    return { elevation, slope, convexity };
      
  } catch (error) {
    console.error('Error processing elevation data:', error);
  }
};

export const processSoilData = (soilData: any) => {
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

export const processWindData = (
  elevationData: { elevationData: Data, slope: DataArray, aspect: DataArray, convexity: DataArray }, 
  climateData: Record<number, ClimateData>
) => {
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
      const weatherData = climateData[year].weatherData;
      if (!weatherData) {
        throw new Error('Weather data not found');
      }
        
      if (weatherData && Object.keys(weatherData).length >= 365) {
        windData = {
          windDir: Object.values(weatherData).map(data => data.windDir),
          windSpeed: Object.values(weatherData).map(data => data.windSpeed),
          gustDir: Object.values(weatherData).map(data => data.gustDir),
          gustSpeed: Object.values(weatherData).map(data => data.gustSpeed),
        };
        break;
      }
    }

    if (windData === null) {
      throw new Error('Calculated wind data is empty');
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