import { calculateGrowingSeason, calculateCornHeatUnits, calculateGDD } from '@/utils/climateUtils';
import { crops, cropLabels, valueToName } from '@/utils/labels';
import { getAvg, getStats } from '@/utils/stats';
import { dayNumToMonthDay } from '@/utils/dates';
import { LandUseData, ElevationData, WeatherData, ClimateData } from '@/types/category';
import { ImageData, DataArray } from '@/types/dataTypes';

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

    // console.log("Backend processing climate data:", newClimateData);
      
    return newClimateData;
  } catch (error) {
    console.error('Error processing climate data:', error);
  }
};

export const processElevationData = (elevationData: { elevationData: ImageData, slope: DataArray, aspect: DataArray, convexity: DataArray }) => {
  try {
    const width = elevationData.elevationData.width;
    const height = elevationData.elevationData.height;
    const slopeData = { sampleData: elevationData.slope, width: width-2, height: height-2 } as ImageData;
    const convexityData = { sampleData: elevationData.convexity, width: width-2, height: height-2 } as ImageData;
      
    const newElevationData = { 
      elevationData: elevationData.elevationData, 
      slopeData: { sampleData: elevationData.slope, width: width-2, height: height-2 } as ImageData, 
      convexityData: { sampleData: elevationData.convexity, width: width-2, height: height-2 } as ImageData, 
    };

    // console.log("Backend processing elevation data:", newElevationData);
      
    return newElevationData;
      
  } catch (error) {
    console.error('Error processing elevation data:', error);
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
      
    const growingSeasonData = {
      x,
      y0: lastFrostDays,
      y1: growingSeasons,
      desc,
      firstFrosts,
      lastFrosts,
      seasons,
    };

    // console.log("Backend processing growing season data:", growingSeasonData);
      
    return growingSeasonData;
    
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
      
    const heatUnitData = {
      years,
      chu: { data: chuData, ...getStats(endOfYearChu) },
      gdd0: { data: gdd0Data, ...getStats(endOfYearGdd0) },
      gdd5: { data: gdd5Data, ...getStats(endOfYearGdd5) },
      gdd10: { data: gdd10Data, ...getStats(endOfYearGdd10) },
      gdd15: { data: gdd15Data, ...getStats(endOfYearGdd15) },
    };

    // console.log("Backend processing heatUnit data:", heatUnitData);


    return heatUnitData;

  } catch (error) {
    console.error('Error processing heat unit data:', error);
  }
};

export const processLandUseData = (landUseDataDict: Record<number,ImageData>, area: number) => {
  try {
    
    const newLandUseData: Record<number, any> = {};
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
            
      // Find the crop with the highest count
      // Map all crops with a frequency of less than 3% to the highest count crop
      // Get list of all crops grown
      let maxCount = 0;
      let highestCropName = crops[0];
      let highestCropValue = 0;
      const cropValuesToConvert: number[] = [];
      const tol = 3;
      let cropSum = 0;
      const cropsGrown: string[] = [];
      Object.entries(counts).forEach(([value, count]) => {
        const itemName = valueToName(cropLabels, Number(value));
          
        if (itemName && crops.includes(itemName)) {
          cropSum += count;
          cropsGrown.push(itemName);
            
          const cropPct = (count / totalSum) * 100;

          if (cropPct < tol) {
            cropValuesToConvert.push(Number(value));
          }
          
          if (count > maxCount) {
            maxCount = count;
            highestCropName = itemName;
            highestCropValue = Number(value);
          }
        }
      });

      console.log("Backend Data Processing", "crops grown", cropsGrown, "counts", counts);

      const convertedLandUseData: DataArray = landUseData.map((value: number | null) => {
        if (value === null) return value;
        if (cropValuesToConvert.includes(value)) {
          counts[highestCropValue] += counts[value];
          delete counts[value];
          return highestCropValue ?? null;
        }
        return value;
      });
        
      const cropLandPct = cropSum / totalSum;

      const imageData: ImageData = {
        sampleData: convertedLandUseData,
        width,
        height
      };
        
      newLandUseData[numericYear] = {
        landUseData: imageData,
        cropArea: Math.round(area * cropLandPct),
        area,
        counts
      };
    });

    // console.log("Backend processing land use data:", newLandUseData);
      
    return newLandUseData;
      
  } catch (error) {
    console.error('Error processing land use data:', error);
  }
};

export const processSoilData = (soilData: any) => {
  try {
    return soilData; // Already processing into ImageData type
      
  } catch (error) {
    console.error('Error processing soil data:', error);
  }
};

export const processWindData = (
  elevationData: { elevationData: ImageData, slope: DataArray, aspect: DataArray, convexity: DataArray }, 
  climateData: Record<number, ClimateData>
) => {
  try {
    const { aspect, slope } = elevationData;
    const width = elevationData.elevationData.width-2;
    const height = elevationData.elevationData.height-2;
      
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

    const windImageData = { sampleData: windExposure, width, height } as ImageData;
    const windDirStats = getStats(windData.windDir);

    const gustImageData = { sampleData: gustExposure, width, height };
    const gustDirStats = getStats(windData.gustDir);

    const newWindData = {
      wind: { windData: windImageData, avgDir: windDirStats.avg, stdDir: windDirStats.std },
      gust: { gustData: gustImageData, avgDir: gustDirStats.avg, stdDir: gustDirStats.std },
    };  

    // console.log("Backend processing wind data:", newWindData);
      
    return newWindData;
      
  } catch (error) {
    console.error('Error processing wind data:', error);
  }
};