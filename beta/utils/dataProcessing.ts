import { calculateGrowingSeason, calculateCornHeatUnits, calculateGDD } from '@/utils/climateUtils';
import { MajorCommodityCrop, majorCommodityCrops } from '@/types/majorCommodityCrops';
import { valuesToNames } from '@/types/valuesToNames';
import { dataToStaticColorUrl, dataToColorScaleUrl } from '@/utils/image';
import chroma from 'chroma-js';

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
        const commodityName: string = valuesToNames[numericKey];
      
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
        const commodityName: string = valuesToNames[numericKey];
      
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

      // Convert pixel values to index in valuesToNames, and 
      // Convert cropKeysToConvert (pixel values that occur less than 3%) to highest % majorCommodityCrop
      const convertedLandUse = landUseData.map((val) => {
        const index = cropKeysToConvert.includes(val)
          ? Object.keys(valuesToNames).findIndex((key) => parseInt(key) === highestCommodityKey)
          : Object.keys(valuesToNames).findIndex((key) => parseInt(key) === val);
      
        return index === -1 ? 0 : index;
      });
        
      // Calculate Land use Pcts
      const usableLandPct = cropSum / totalSum;
      const area = totalSum;

      // Generate image URL and legend
      const colors = chroma.scale('Set1').colors(Object.keys(valuesToNames).length);
      const imageUrl = dataToStaticColorUrl(convertedLandUse, width, height, 0, colors, 10);
      const uniqueElements = new Set(convertedLandUse);
      const legend: Record<string, string> = {};

      uniqueElements.forEach((value) => {
        const name = valuesToNames[value];
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
      const { firstFrost, lastFrost, growingSeasonLength } = calculateGrowingSeason(weatherData);
      const cornHeatUnits = calculateCornHeatUnits(weatherData);
      const GDD0 = calculateGDD(weatherData, 0);
      const GDD5 = calculateGDD(weatherData, 5);
      const GDD10 = calculateGDD(weatherData, 10);
      const GDD15 = calculateGDD(weatherData, 15);
      
      newClimateData[key] = {
        weatherData,
        firstFrost,
        lastFrost,
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