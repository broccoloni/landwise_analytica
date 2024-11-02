import { NextRequest, NextResponse } from 'next/server';
import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';

// NOTE: Longitude must come first in google earth engine.

var privateKey = require('/landwise-analytica-service-key.json');

// const years = ['2017', '2018', '2019', '2020', '2021', '2022'];
const years = ['2022'];

const cropNames = [
  'Barley', 'Corn for grain', 'Oats', 'Soybeans', 'Canola', 
  'Flaxseed', 'Lentils', 'Mustard seed', 'Peas, dry', 
  'Wheat, spring', 'Wheat, winter remaining', 'Chick peas', 
  'Triticale'
];

// const cropNames = [
//   'Barley',
// ];

const crops = [133, 147, 136, 158, 153, 154, 174, 155, 162, 146, 145, 163, 139];
// const crops = [133];

const bands = [
  'BRDF_Albedo_Band_Mandatory_Quality_Band1',
  'BRDF_Albedo_Band_Mandatory_Quality_Band2',
  'BRDF_Albedo_Band_Mandatory_Quality_Band3',
  'BRDF_Albedo_Band_Mandatory_Quality_Band4',
  'BRDF_Albedo_Band_Mandatory_Quality_Band5',
  'BRDF_Albedo_Band_Mandatory_Quality_Band6',
  'BRDF_Albedo_Band_Mandatory_Quality_Band7',
  'DayOfYear', 'DetailedQA', 'EVI', 'FparExtra_QC', 
  'FparLai_QC', 'FparStdDev_500m', 'Fpar_500m', 
  'LaiStdDev_500m', 'Lai_500m', 'NDVI', 
  'Nadir_Reflectance_Band1', 'Nadir_Reflectance_Band2', 
  'Nadir_Reflectance_Band3', 'Nadir_Reflectance_Band4', 
  'Nadir_Reflectance_Band5', 'Nadir_Reflectance_Band6', 
  'Nadir_Reflectance_Band7', 'RelativeAzimuth', 
  'SolarZenith', 'SummaryQA', 'ViewZenith', 
  'fesc', 'sur_refl_b01', 'sur_refl_b02', 
  'sur_refl_b03', 'sur_refl_b07'
];

async function getOverlappingDates(collections) {
  return new Promise((resolve, reject) => {
    try {
      var all_timestamps = collections.map(function(collection) {
        return collection.aggregate_array('system:time_start');
      });

      var flattened_timestamps = ee.List(all_timestamps).flatten();
      var date_strings = flattened_timestamps.map(function(timestamp) {
        return ee.Date(ee.Number(timestamp)).format('YYYY-MM-dd');
      });

      var frequencyDict = date_strings.reduce(ee.Reducer.frequencyHistogram());

      var valid_timestamps = ee.Dictionary(frequencyDict);
      var overlapping_dates = valid_timestamps.keys().map(function(key) {
        var count = ee.Number(valid_timestamps.get(key));
        var date = ee.Date(ee.Number(key)).format('YYYY-MM-dd');
        return ee.Algorithms.If(count.eq(collections.length), date, null);
      }).filter(ee.Filter.notNull(['item']));

      overlapping_dates.evaluate(function(dates) {
        resolve(dates);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function sampleDate(imgCollection, date) {
  return imgCollection.filterDate(date).first();
}

async function fescBand(image) {
  return new Promise((resolve, reject) => {
    try {
      var NIR = image.select('sur_refl_b02');
      var FPAR = image.select('Fpar_500m');
      var NDVI = image.select('NDVI');

      if (NIR && FPAR && NDVI) {
        var FPAR_adjusted = FPAR.add(0.0000001);
        var fesc = NIR.multiply(NDVI).divide(FPAR_adjusted).rename('fesc');

        var updatedImage = image.addBands({
          srcImg: fesc,
          overwrite: true,
        });

        resolve(updatedImage);
      } else {
        resolve(image);
      }
    } catch (error) {
      console.error('Error in fescBand function:', error);
      reject(error);
    }
  });
}

async function reduceAndEvaluateImage(image, geometry, scale) {
  if (!image || !geometry) {
    throw new Error('Invalid image or geometry provided');
  }
  try {         
    var reduced_image = image.reduceRegion({
      reducer: ee.Reducer.toList(),
      geometry: geometry,
      scale: scale,
      maxPixels: 1e13
    });

    return new Promise((resolve, reject) => {
      reduced_image.evaluate((result, error) => {
        if (error) {
          console.error('Error evaluating the reduced image:', error);
          reject(new Error(`Failed to evaluate image: ${error.message}`));
        } else {
          resolve(result);  // Resolve the Promise with the result
        }
      });
    });
      
  } catch (error) {
    console.error('Error in reduceAndEvaluateImage function:', error.message);
    throw error;
  }
}

async function retrieveCrops(geometry) {
  const results = {};

  for (const year of years) {
    try {
      // Contains Leaf Area Index (LAI) and Fraction of Photosynthetically Active Radiation (FPAR)
      var MOD15A2H = ee.ImageCollection('MODIS/061/MOD15A2H').filterDate(`${year}-01-01`,`${year}-12-31`);

      // Contains Normalized Difference Vegetation Index (NDVI) and the Enhanced Vegetation Index (EVI)
      var MOD13Q1 = ee.ImageCollection('MODIS/061/MOD13Q1').filterDate(`${year}-01-01`,`${year}-12-31`);

      // Contains surface reflectance values
      var MCD43A4 = ee.ImageCollection('MODIS/061/MCD43A4').filterDate(`${year}-01-01`,`${year}-12-31`);
    
      const overlappingDates = await getOverlappingDates([MOD15A2H, MOD13Q1, MCD43A4]);
      if (overlappingDates.length === 0) {
        throw new Error("No overlapping dates");
      }
        
      var combinedImagesPromises = overlappingDates.map(async function(date) {
        var image_MOD13Q1 = await sampleDate(MOD13Q1, date);              
        var image_MOD15A2H = await sampleDate(MOD15A2H, date);
        var image_MCD43A4 = await sampleDate(MCD43A4, date);
      
        if (image_MOD13Q1 && image_MOD15A2H && image_MCD43A4) {
          return ee.Image(image_MOD13Q1).addBands(image_MOD15A2H).addBands(image_MCD43A4);
        } else {
          console.log(`Skipping date ${date} due to missing image`);
          return null;
        }
      });
    
      var combinedImages = await Promise.all(combinedImagesPromises);
      combinedImages = combinedImages.filter(image => image !== null);            

      var vegReflectanceImagesPromises = combinedImages.map(fescBand);
      var vegReflectanceImages = await Promise.all(vegReflectanceImagesPromises);
      var vegReflectance = ee.ImageCollection(vegReflectanceImages);
      var vegReflectanceBands = vegReflectance.toBands();
        
      var pixelArea = ee.Image.pixelArea();
      vegReflectanceBands = vegReflectanceBands.addBands({
        srcImg: pixelArea,
        overwrite: true,
      }).unmask(0)

      // Get the historical land use
      var AAFC_image = ee.ImageCollection('AAFC/ACI')
          .filterDate(`${year}-01-01`,`${year}-12-31`)
          .first();
      var AAFCData = await reduceAndEvaluateImage(AAFC_image, geometry, 30);
        
      results[year] = { AAFCData };
        
      for (const crop of crops) {
        console.log(`Processing geometry for crop: ${cropNames[crops.indexOf(crop)]} of year ${year}`);
    
        vegReflectanceBands.updateMask(AAFC_image.eq(crop));
                  
        // returns an image where each 'pixel' has the value from each of the 30+ bands 
        var pixelValues = await reduceAndEvaluateImage(vegReflectanceBands, geometry, 50);
          
        results[year][cropNames[crops.indexOf(crop)]] = pixelValues;

      }
    } catch (error) {
      console.error(`Error processing crop ${cropNames[crops.indexOf(crop)]} for year ${year}:`, error);
    }
  }
  return results;
}

export async function POST(req: NextRequest) {
  try {
    const { points } = await req.json();
      
    if (!points || !Array.isArray(points) || points.length === 0) {
      console.log('Invalid input');
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    // Initialize Earth Engine
    await new Promise<void>((resolve, reject) => {
      console.log('Starting Earth Engine authentication...');
      ee.data.authenticateViaPrivateKey(privateKey, 
        () => {
          console.log('Authentication successful. Initializing Earth Engine...');
          ee.initialize(null, null, () => {
            console.log('Earth Engine initialized successfully.');
            resolve();
          }, (err) => {
            console.error('Error initializing Earth Engine:', err);
            reject(err);
          });
        }, (err) => {
          console.error('Error during authentication:', err);
          reject(err);
        });
    });

    const polygon = ee.Geometry.Polygon(points);      
    const results = await retrieveCrops(polygon);

    // Split the results into historicalLandUse and cropData
    const historicalLandUse: { [year: string]: any } = {};
    const cropData: { [year: string]: any } = {};

    for (const [year, data] of Object.entries(results)) {
      // Extract AAFCData for the current year and assign to historicalLandUse
      historicalLandUse[year] = data.AAFCData;

      // Create a shallow copy of the year's data excluding AAFCData
      const { AAFCData, ...cropYearData } = data;
      cropData[year] = cropYearData;
    }

    return NextResponse.json({ 
      historicalLandUse, 
      cropData 
    }, { status: 200 });
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

