import { NextRequest, NextResponse } from 'next/server';
import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';

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

async function sampleDate(imgCollection, date) {
  return imgCollection.filterDate(date).first();
}

async function fescBand(image) {
  try {
    var NIR = image.select('sur_refl_b02');
    var FPAR = image.select('Fpar_500m');
    var NDVI = image.select('NDVI');

    if (NIR && FPAR && NDVI) {
      
      // Avoid division by zero by adding a small value to FPAR
      var FPAR_adjusted = FPAR.add(0.0000001);
      var fesc = (NIR.multiply(NDVI).divide(FPAR_adjusted)).rename('fesc');

      return image.addBands({
        srcImg: fesc,
        overwrite: true,
      });
        
    } else {
      console.log("Error: Not all necessary bands found (NIR, FPAR, NDVI)");
      console.log('NIR exists:', !!NIR);
      console.log('FPAR exists:', !!FPAR);
      console.log('NDVI exists:', !!NDVI);
    }
  } catch (error) {
    console.error('Error in fescBand function:', error);
  }

  return image;
}

async function retrieveCrops(geometry) {
  const results = {};

  for (const year of years) {
      for (const crop of crops) {
        console.log(`Processing geometry for crop: ${cropNames[crops.indexOf(crop)]} of year ${year}`);
        try {
          var AAFC_mask = ee.ImageCollection('AAFC/ACI')
            .filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`)).first()
            .eq(crop);

          var MOD15A2H = ee.ImageCollection('MODIS/061/MOD15A2H').filterDate(`${year}-01-01`, `${year}-12-31`);
          var MOD13Q1 = ee.ImageCollection('MODIS/061/MOD13Q1').filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`));
          var MCD43A4 = ee.ImageCollection('MODIS/061/MCD43A4').filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`));

          const full_dates = await MOD13Q1.aggregate_array('system:time_start').getInfo();
          const dates = full_dates.map(timestamp => {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          });
            
          const combinedImages = [];

          for (const date of dates) {
            var image_MOD13Q1 = await sampleDate(MOD13Q1, date);              
            var image_MOD15A2H = await sampleDate(MOD15A2H, date);
            var image_MCD43A4 = await sampleDate(MCD43A4, date);
              
            if (image_MOD13Q1 && image_MOD15A2H && image_MCD43A4) {
              var combinedImage = image_MOD13Q1.addBands({
                srcImg: image_MOD15A2H,
                overwrite: true,
              }).addBands({
                srcImg: image_MCD43A4,
                overwrite: true,
              });
              combinedImages.push(combinedImage);
            } else {
              console.log(`Skipping date ${date} due to missing image`);
            }
          }

          const vegReflectanceImages = ee.ImageCollection.fromImages(combinedImages);            
          const vegReflectance = vegReflectanceImages.map(fescBand);
          var vegReflectanceBands = vegReflectance.toBands();
          var pixelArea = ee.Image.pixelArea();

          vegReflectanceBands = vegReflectanceBands.addBands({
            srcImg: pixelArea,
            overwrite: true,
          }).unmask(0).updateMask(AAFC_mask);
            
          const pixelValues = await vegReflectanceBands.reduceRegion({
            reducer: ee.Reducer.toList(),
            geometry: geometry,
            scale: 50,
            maxPixels: 1e13
          });

          const clientSidePixelValues = await new Promise((resolve, reject) => {
            pixelValues.evaluate((result, error) => {
              if (error) {
                console.error("Error evaluating pixel values:", error);
                reject(error);
              } else {
                resolve(result);
              }
            });
          });
            
          if (!results[year]) {
            results[year] = {};
          }        
            
          // Debug logging for client-side pixel values
          if (clientSidePixelValues) {
            console.log("Client-side pixel values:", clientSidePixelValues);  
            results[year][cropNames[crops.indexOf(crop)]] = clientSidePixelValues;
          } else {
            console.log("No client-side pixel values returned.");
          }            
            
        } catch (error) {
          console.error(`Error processing crop ${cropNames[crops.indexOf(crop)]} for year ${year}:`, error);
        }
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

    const multiPoint = ee.Geometry.MultiPoint(points);      
    const results = await retrieveCrops(multiPoint);

    return NextResponse.json({ message: 'Processing completed', results }, { status: 200 });
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
