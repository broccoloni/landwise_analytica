import { NextRequest, NextResponse } from 'next/server';
import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';

var privateKey = require('/landwise-analytica-service-key.json');

console.log(privateKey);

// const years = ['2017', '2018', '2019', '2020', '2021', '2022'];
const years = ['2022'];

const cropNames = [
  'Barley', 'Corn for grain', 'Oats', 'Soybeans', 'Canola', 
  'Flaxseed', 'Lentils', 'Mustard seed', 'Peas, dry', 
  'Wheat, spring', 'Wheat, winter remaining', 'Chick peas', 
  'Triticale'
];
const crops = [133, 147, 136, 158, 153, 154, 174, 155, 162, 146, 145, 163, 139];

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

async function extractDate(image) {
  return ee.Feature(null, { 'date': ee.Date(image.get('system:time_start')).format('YYYY-MM-dd') });
}

async function sampleDate(imgCollection, date) {
  return imgCollection.filterDate(date).first();
}

async function fescBand(image) {
  const NIR = image.select('sur_refl_b02');
  const FPAR = image.select('Fpar_500m').add(0.0000001);
  const NDVI = image.select('NDVI');
  const Fesc = NIR.multiply(NDVI).divide(FPAR);
  return image.addBands(Fesc.rename('fesc'));
}

async function retrieveCrops(points) {
  const results = [];

  for (const crop of crops) {
    for (const [j, geometry] of points.entries()) {
      console.log(`Processing geometry ${j} for crop: ${cropNames[crops.indexOf(crop)]}`);
      for (const year of years) {
        console.log(`Year: ${year}`);
        try {
          const AAFC_mask = ee.ImageCollection('AAFC/ACI')
            .filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`)).first()
            .eq(crop);

          const MOD15A2H = ee.ImageCollection('MODIS/061/MOD15A2H').filterDate(`${year}-01-01`, `${year}-12-31`);
          const MOD13Q1 = ee.ImageCollection('MODIS/061/MOD13Q1').filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`));
          const MCD43A4 = ee.ImageCollection('MODIS/061/MCD43A4').filter(ee.Filter.date(`${year}-01-01`, `${year}-12-31`));

          const dates = (await MOD13Q1.map(extractDate).getInfo()).map(date => date.date);
          const combinedImages = [];

          for (const date of dates) {
            const image_MOD13Q1 = await sampleDate(MOD13Q1, date);
            const image_MOD15A2H = await sampleDate(MOD15A2H, date);
            const image_MCD43A4 = await sampleDate(MCD43A4, date);
            const combinedImage = image_MOD13Q1.addBands(image_MOD15A2H).addBands(image_MCD43A4);
            combinedImages.push(combinedImage);
          }

          const vegReflectance = ee.ImageCollection.fromImages(combinedImages).map(fescBand);
          const vegReflectanceBands = vegReflectance.toBands()
            .addBands(vegReflectanceBands.pixelArea())
            .unmask(0)
            .updateMask(AAFC_mask);

          const pixelValues = await vegReflectanceBands.reduceRegion({
            reducer: ee.Reducer.toList(),
            geometry: geometry,
            scale: 250,
            maxPixels: 1e13
          }).getInfo();

          results.push({
            crop: cropNames[crops.indexOf(crop)],
            year: year,
            geometry: geometry,
            pixelValues: pixelValues
          });

          console.log(`Pixel values for ${cropNames[crops.indexOf(crop)]} in ${year}:`, pixelValues);
        } catch (error) {
          console.error(`Error processing crop ${cropNames[crops.indexOf(crop)]} for year ${year}:`, error);
        }
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
    const results = await retrieveCrops(multiPoint);

    return NextResponse.json({ message: 'Processing completed', results }, { status: 200 });
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
