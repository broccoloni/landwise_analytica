'use client';

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
      
      const counts: Record<string, number> = {};
      landUseData.forEach((value) => {
        const numericKey = parseInt(value);
        const commodityName: string = cropNames[numericKey];

        if (value !== null && value !== 'Cloud') {
          counts[commodityName] = (counts[commodityName] || 0) + 1;
        }
      });

      // Calculate Land use Pcts
      const area = Object.values(counts).reduce((acc, count) => acc + count, 0);
      const cropArea = majorCommodityCrops.reduce((acc, key) => acc + (counts[key] || 0), 0);
        
      const landUseImageData = getImageLegendUnique({ sampleData: landUseData, width, height }, cropNames, scale);
      const { imageUrl, legend, uniqueElements } = landUseImageData;

        
      newLandUseData[year] = {
        imageUrl,
        legend,
        counts,
        cropArea,
        area,
      };
    });

    return newLandUseData;
      
  } catch (error) {
    console.error('Error processing land use data:', error);
  }
};

export const processHistoricData = (data) => {
  try {
    const landUseDataDict = data.landUseData;
    const yearlyYields = data.yearlyYields;
    const historicYears = Object.keys(landUseDataDict);
      
    const predominantCropGrown = historicYears.map((year: number) => {
      const { landUseData, width, height } = landUseDataDict[year];
      
      const majorCommodityCropCounts: Record<string, number> = {};
        
      landUseData.forEach((value) => {
        if (value !== null) {
          const numericKey = parseInt(value);
          const commodityName: string = cropNames[numericKey];
          if (majorCommodityCrops.includes(commodityName as MajorCommodityCrop)) {
            majorCommodityCropCounts[commodityName] = (majorCommodityCropCounts[commodityName] || 0) + 1;
          }
        }
      });

      let highestCount = 0;
      let cropWithHighestCount = null;
    
      for (const [crop, count] of Object.entries(majorCommodityCropCounts)) {
        if (count > highestCount) {
          highestCount = count;
          cropWithHighestCount = crop;
        }
      }
    
      return cropWithHighestCount; 
    });

    const labels = historicYears.map((year, index) => `${year} - ${predominantCropGrown[index]}`);
    const property = historicYears.map((year, index) => {
      const row = yearlyYields.find((item) => 
        item.Crop === predominantCropGrown[index] && 
        item.Year === parseInt(year) && 
        item.levels === 'Property'
      );
      return row?.Yield || null;
    });

    const neighbourhood = historicYears.map((year, index) => {
      const row = yearlyYields.find((item) => 
        item.Crop === predominantCropGrown[index] && 
        item.Year === parseInt(year) && 
        item.levels === 'Neighbourhood'
      );
      return row?.Yield || null;
    });
      
    const national = historicYears.map((year, index) => {
      const row = yearlyYields.find((item) => 
        item.Crop === predominantCropGrown[index] && 
        item.Year === parseInt(year) && 
        item.levels === 'National'
      );
      return row?.Yield || null;
    });
      
    const neighbourhoodPerfs = property.map((cropYeild: number, index: number) => cropYeild / neighbourhood[index] * 100);
    const nationalPerfs = property.map((cropYeild: number, index: number) => cropYeild / national[index] * 100);
    const avgNePerf = getAvg(neighbourhoodPerfs);
    const stdNePerf = getStd(neighbourhoodPerfs);
    const avgNaPerf = getAvg(nationalPerfs);
    const stdNaPerf = getStd(nationalPerfs);

    const cropsGrown = Array.from(new Set(predominantCropGrown));
      
    return {
      labels,
      property,
      neighbourhood,
      national,
      avgNePerf,
      stdNePerf,
      avgNaPerf,
      stdNaPerf,
      cropsGrown,
    };
      
  } catch (error) {
    console.error('Error processing historic data:', error);
  }
};

export const processProjectedData = (data) => {
  const minYear = 2014;
  const maxYear = 2034;
  const curYear = 2024;
  try {
    const yearlyYields = data.yearlyYields;
    const projectedData = {};

    const years = Array.from(
      new Set(
        yearlyYields
          .map((item: any) => Number(item.Year))
          .filter((year: number) => year >= minYear && year <= maxYear)
      ) 
    );
      
    
    majorCommodityCrops.forEach((crop: string) => {
      const property = [];
      const neighbourhood = [];
      const national = [];
      for (const yr of years) {
        if (yr >= minYear && yr <= maxYear) {
          const pr = yearlyYields.find((item) => 
            item.Crop === crop && 
            item.Year === parseInt(yr) && 
            item.levels === 'Property'
          );

          const ne = yearlyYields.find((item) => 
            item.Crop === crop && 
            item.Year === parseInt(yr) && 
            item.levels === 'Neighbourhood'
          );

          const na = yearlyYields.find((item) => 
            item.Crop === crop && 
            item.Year === parseInt(yr) && 
            item.levels === 'National'
          );

          property.push(pr.Yield);
          neighbourhood.push(ne.Yield);
          national.push(na.Yield);
        }
      }
        
      const futProperty = property.filter((_, index) => years[index] >= curYear); 
      const futNeighbourhood = neighbourhood.filter((_, index) => years[index] >= curYear); 
      const futNational = national.filter((_, index) => years[index] >= curYear); 

      const neighbourhoodPerfs = futProperty.map((cropYield: number, index: number) => cropYield / futNeighbourhood[index] * 100);
      const nationalPerfs = futProperty.map((cropYield: number, index: number) => cropYield / futNational[index] * 100);

      const avgNePerf = getAvg(neighbourhoodPerfs);
      const stdNePerf = getStd(neighbourhoodPerfs);
      const avgNaPerf = getAvg(nationalPerfs);
      const stdNaPerf = getStd(nationalPerfs);

      const avgPerf = (avgNePerf + avgNaPerf)/2;
        

      projectedData[crop] = { 
        years,
        property, 
        neighbourhood, 
        national, 
        avgNePerf, 
        stdNePerf,
        avgNaPerf,
        stdNaPerf,
        avgPerf,
      };
    });
      
    return projectedData
      
  } catch (error) {
    console.error('Error processing projected data:', error);
  }
};


export const processCropHeatmapData = (data) => {
  try {
    const cropHeatmaps = data.cropHeatmaps;
    const cropHeatmapData = {};

    Object.entries(cropHeatmaps).forEach(([crop, heatmap]) => {
      const heatmapData = getImageAndStats(heatmap, scale, heatColors);

      cropHeatmapData[crop] = {
        ...heatmapData,
        variation: heatmapData.std / (heatmapData.avg ?? 1),
      }
    });

    return cropHeatmapData;
    
  } catch (error) {
    console.error('Error processing crop heatmap data:', error);
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