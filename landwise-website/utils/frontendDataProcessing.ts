import { getImageAndStats, getImageLegendUnique, getBandImagesAndStats, getBandImagesLegendsUnique } from '@/utils/image';
import { heatColors, rangeColors, colorSet } from '@/utils/colorPalettes';
import { cropLabels, soilTaxonomyLabels, soilTextureLabels } from '@/utils/labels';

const processReportData = (data: any): void => {
  try {
    processLandUseData(data);
    processGrowingSeasonData(data);
    processHeatUnitData(data);
    processClimateData(data);
    processElevationData(data);
    processSoilData(data);
    processWindData(data);  
      
  } catch (error) {
    console.error('Error during frontend processing', error);
  }
};

export default processReportData;

const processClimateData = (data: any): void => {
  try {
    const climateData = data.climateData;

    if (!climateData) {
      throw new Error('Climate data not found');
    }

  } catch (error) {
    console.error('Error processing Climate Data:', error);
  }
};

const processElevationData = (data: any): void => {
  try {
    const elevationData = data.elevationData;

    if (!elevationData) {
      throw new Error('Elevation data not found');
    }

    const elevation = getImageAndStats(elevationData.elevationData, rangeColors);
    const slope = getImageAndStats(elevationData.slopeData, rangeColors);
    const convexity = getImageAndStats(elevationData.convexityData, rangeColors);

    data.elevationData = { elevation, slope, convexity };
      
  } catch (error) {
    console.error('Error processing Elevation Data:', error);
  }
};

const processGrowingSeasonData = (data: any): void => {
  try {
    const growingSeasonData = data.climateData;

    if (!growingSeasonData) {
      throw new Error('Growing Season data not found');
    }

  } catch (error) {
    console.error('Error processing Growing Season Data:', error);
  }
};

const processHeatUnitData = (data: any): void => {
  try {
    const heatUnitData = data.heatUnitData;

    if (!heatUnitData) {
      throw new Error('Heat Unit data not found');
    }

  } catch (error) {
    console.error('Error processing Heat Unit Data:', error);
  }
};

const processLandUseData = (data: any): void => {
  try {
    const landUseData = data.landUseData;

    if (!landUseData) {
      throw new Error('Land use data not found');
    }

    Object.entries(landUseData).forEach(([year, yearLandUseData]: [string, any]) => {
      const { landUseData: yearImageData, cropArea, area, counts } = yearLandUseData;        
      const { imageUrl, legend, uniqueElements } = getImageLegendUnique(yearImageData, cropLabels, colorSet);
      
      // Modify the data for the current year
      data.landUseData[Number(year)] = {
        imageUrl,
        legend,
        cropArea,
        area,
        counts,
      };
    });

  } catch (error) {
    console.error('Error processing Land Use Data:', error);
  }
};

const processSoilData = (data: any): void => {
  try {
    const soilData = data.soilData;

    if (!soilData) {
      throw new Error('Soil data not found');
    }

    const taxonomy = getImageLegendUnique(soilData.taxonomyData.grtgroup, soilTaxonomyLabels, colorSet);
    const texture = getBandImagesLegendsUnique(soilData.textureData, soilTextureLabels, colorSet);

    // Soil Contents
    const water = getBandImagesAndStats(soilData.waterData, heatColors);
    const sand = getBandImagesAndStats(soilData.sandData, heatColors);
    const clay = getBandImagesAndStats(soilData.clayData, heatColors);
    const carbon = getBandImagesAndStats(soilData.carbonData, heatColors);

    // Soil Attributes
    const ph = getBandImagesAndStats(soilData.phData, heatColors);
    const density = getBandImagesAndStats(soilData.densityData, heatColors);

    data.soilData = {
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
    console.error('Error processing Soil Data:', error);
  }
};

const processWindData = (data: any): void => {
  try {
    const rawWindData = data.windData;

    if (!rawWindData) {
      throw new Error('Wind data not found');
    }

    const { windData, avgDir: avgWindDir, stdDir: stdWindDir } = rawWindData.wind;
    const { gustData, avgDir: avgGustDir, stdDir: stdGustDir } = rawWindData.gust;
    const wind = getImageAndStats(windData, rangeColors);
    const gust = getImageAndStats(gustData, rangeColors);

    data.windData = {
      wind: { ...wind, avgDir: avgWindDir, stdDir: stdWindDir },
      gust: { ...gust, avgDir: avgGustDir, stdDir: stdGustDir },
    };

  } catch (error) {
    console.error('Error processing Wind Data:', error);
  }
};

