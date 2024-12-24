import { NextRequest, NextResponse } from 'next/server';
import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';
import { initializeEarthEngine } from '@/lib/initEarthEngine';
import { fetchLandUseData } from '@/lib/fetchLandUseData';
import { fetchElevationData } from '@/lib/fetchElevationData';
import { fetchCropData } from '@/lib/fetchCropData';
import { fetchClimateData } from '@/lib/fetchClimateData';
import { fetchSoilData } from '@/lib/fetchSoilData';
import { ReportStatus } from '@/types/statuses'; 
import { processClimateData, processLandUseData, processElevationData, processWindData, processSoilData } from '@/utils/dataProcessing';

// NOTE: Longitude must come first in google earth engine. Latitude comes first in leaflet

// const dataYears = ['2014','2015','2016','2017', '2018', '2019', '2020', '2021', '2022','2023','2024'];
const dataYears = ['2021','2022'];

export async function POST(req: NextRequest) {
  try {
    const { reportId, status, address, addressComponents, landGeometry } = await req.json();
      
    if (!landGeometry || !Array.isArray(landGeometry) || landGeometry.length < 3 || !reportId || !status) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    if (status === ReportStatus.Unredeemed && (!address || !addressComponents)) {
      return NextResponse.json({ message: 'Details not provided to redeem report' }, { status: 400 });
    }

    if (status === ReportStatus.Unredeemed) {
      await initializeEarthEngine();
      const polygon = ee.Geometry.Polygon(landGeometry);      

      // Download all data
      const landUseData = await fetchLandUseData(dataYears, polygon);
      const climateData = await fetchClimateData(dataYears, polygon);
      const elevationData = await fetchElevationData(polygon);
      const soilData = await fetchSoilData(polygon);
      // const cropData = await fetchCropData(polygon, dataYears);
      const cropData = null;

      // Process all data
              
        
      const bounds = await polygon.bounds().getInfo();
      const boundCoordinates = bounds.coordinates[0];
      const centroid = await polygon.centroid().getInfo();
        
      // Note that we're switching from longitude first to latitude first for leaflet use here
      const data = { 
        latitude: centroid.coordinates[1],
        longitude: centroid.coordinates[0],
        address,
        addressComponents,
        landGeometry,
        status: ReportStatus.Redeemed,
        bbox: [
          [boundCoordinates[0][1], boundCoordinates[0][0]],
          [boundCoordinates[2][1], boundCoordinates[2][0]]
        ],
        heatUnitData,
        growingSeasonData,
        climateData,
        elevationData,        
        landUseData, 
        windData,
        soilData,
        cropData, // a reminder to add this when yields are done
      };

      // // To save the data
      // const filePath = path.join(process.cwd(), 'downloadedData.json');

      // // Write the data to the JSON file
      // fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
      // Save processed data to AWS S3
      // Update Reports table with new status and redeemedAt
        
      return NextResponse.json(data, { status: 200 });
    } 

    else if (status === ReportStatus.Redeemed) {
      // Retrieve data from AWS S3
      const data = null;
      return NextResponse.json(data, { status: 200 });
    }

    else {
      return NextResponse.json({ message: "This should not be possible, how did you get here?" }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

