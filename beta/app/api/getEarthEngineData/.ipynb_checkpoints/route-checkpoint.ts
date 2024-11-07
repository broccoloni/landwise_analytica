import { NextRequest, NextResponse } from 'next/server';
import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';
import { initializeEarthEngine } from '@/lib/initEarthEngine';
import { fetchLandUseData } from '@/lib/fetchLandUseData';
import { fetchElevationData } from '@/lib/fetchElevationData';
import { evaluateImage } from '@/utils/earthEngineUtils';
import { fetchCropData } from '@/lib/fetchCropData';
import { fetchClimateData } from '@/lib/fetchClimateData';

// NOTE: Longitude must come first in google earth engine.

// const dataYears = ['2017', '2018', '2019', '2020', '2021', '2022'];
const dataYears = ['2022'];

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

export async function POST(req: NextRequest) {
  try {
    const { points } = await req.json();
      
    if (!points || !Array.isArray(points) || points.length === 0) {
      console.log('Invalid input');
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    await initializeEarthEngine();

    const polygon = ee.Geometry.Polygon(points);      

    const climateData = await fetchClimateData(dataYears, polygon);
    const historicalLandUse = await fetchLandUseData( dataYears, polygon );
    // const cropData = await fetchCropData(polygon, dataYears, crops, cropNames);
    const elevationData = await fetchElevationData(polygon);
    const cropData = null;
    // const historicalLandUse = null;
    // const elevationData = null;
    // const climateData = null;
      
    return NextResponse.json({ 
      historicalLandUse, 
      cropData,
      elevationData,
      climateData,
      bbox: polygon.bounds(),
    }, { status: 200 });
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

