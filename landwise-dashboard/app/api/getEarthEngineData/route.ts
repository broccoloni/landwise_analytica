import { NextRequest, NextResponse } from 'next/server';
import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';

var privateKey = require('/landwise-analytica-service-key.json');

// const years = ['2017', '2018', '2019', '2020', '2021', '2022'];
const years = ['2022'];

// const cropNames = [
//   'Barley', 'Corn for grain', 'Oats', 'Soybeans', 'Canola', 
//   'Flaxseed', 'Lentils', 'Mustard seed', 'Peas, dry', 
//   'Wheat, spring', 'Wheat, winter remaining', 'Chick peas', 
//   'Triticale'
// ];

const cropNames = [
  'Barley'
];

// const crops = [133, 147, 136, 158, 153, 154, 174, 155, 162, 146, 145, 163, 139];
const crops = [133];

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
    const NIR = image.select('sur_refl_b02');
    const FPAR = image.select('Fpar_500m');
    const NDVI = image.select('NDVI');

    if (NIR && FPAR && NDVI) {
      console.log('Adding fesc band');
      
      // Avoid division by zero by adding a small value to FPAR
      const FPAR_adjusted = FPAR.add(0.0000001);
      const Fesc = NIR.multiply(NDVI).divide(FPAR_adjusted);

      console.log('Fesc band created');
      return image.addBands(Fesc.rename('fesc'));
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
  const results = [];

  for (const crop of crops) {
      console.log(`Processing geometry for crop: ${cropNames[crops.indexOf(crop)]}`);
      for (const year of years) {
        console.log(`Year: ${year}`);
        try {
          const AAFC_mask = ee.ImageCollection('AAFC/ACI')
            .filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`)).first()
            .eq(crop);

          const MOD15A2H = ee.ImageCollection('MODIS/061/MOD15A2H').filterDate(`${year}-01-01`, `${year}-12-31`);
          const MOD13Q1 = ee.ImageCollection('MODIS/061/MOD13Q1').filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`));
          const MCD43A4 = ee.ImageCollection('MODIS/061/MCD43A4').filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`));

          const full_dates = await MOD13Q1.aggregate_array('system:time_start').getInfo();
          const dates = full_dates.map(timestamp => {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          });
          console.log("Extracted dates:", dates);
            
          const combinedImages = [];

          for (const date of dates) {
            const image_MOD13Q1 = await sampleDate(MOD13Q1, date);              
            const image_MOD15A2H = await sampleDate(MOD15A2H, date);
            const image_MCD43A4 = await sampleDate(MCD43A4, date);
          
            if (image_MOD13Q1 && image_MOD15A2H && image_MCD43A4) {
              const combinedImage = image_MOD13Q1.addBands(image_MOD15A2H).addBands(image_MCD43A4);
              combinedImages.push(combinedImage);
            } else {
              console.log(`Skipping date ${date} due to missing image`);
            }
          }

          // console.log("Combined Images:", combinedImages);

          const vegReflectanceImages = ee.ImageCollection.fromImages(combinedImages);
          console.log("veg reflectance images:", vegReflectanceImages);
            
          const vegReflectance = vegReflectanceImages.map(fescBand);
          console.log("veg reflectance:", vegReflectance);

          let vegReflectanceBands = vegReflectance.toBands();
          const pixelAreaBand = ee.Image.pixelArea();
          vegReflectanceBands = vegReflectanceBands.addBands(pixelAreaBand).unmask(0).updateMask(AAFC_mask);
            
          const pixelValues = await vegReflectanceBands.reduceRegion({
            reducer: ee.Reducer.toList(),
            geometry: geometry,
            scale: 50,
            maxPixels: 1e13
          }).getInfo();

          console.log("pixel values:", pixelValues);
            
          results.push({
            crop: cropNames[crops.indexOf(crop)],
            year: year,
            geometry: geometry,
            pixelValues: pixelValues
          });

          console.log("results:", results);
            
          console.log(`Pixel values for ${cropNames[crops.indexOf(crop)]} in ${year}:`, pixelValues);
        } catch (error) {
          console.error(`Error processing crop ${cropNames[crops.indexOf(crop)]} for year ${year}:`, error);
        }
      }
    
  }
  return results;
}

export async function POST(req: NextRequest) {
  console.log('POST request received');
  try {
    const { points } = await req.json();
    console.log('Received points:', points);
      
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

    console.log("multiPoint:", multiPoint);
      
    const results = await retrieveCrops(multiPoint);

    return NextResponse.json({ message: 'Processing completed', results }, { status: 200 });
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
