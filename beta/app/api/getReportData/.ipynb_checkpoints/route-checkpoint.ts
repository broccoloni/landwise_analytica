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
import { storeReportInS3, getReportFromS3, updateReportAttributes } from '@/lib/database';
import { 
  processHeatUnitData,
  processGrowingSeasonData,
  processClimateData, 
  processLandUseData, 
  processElevationData, 
  processWindData, 
  processSoilData 
} from '@/utils/dataProcessing';

// NOTE: Longitude must come first in google earth engine. Latitude comes first in leaflet

// const dataYears = ['2014','2015','2016','2017', '2018', '2019', '2020', '2021', '2022','2023','2024'];
const dataYears = ['2021','2022'];

export async function POST(req: NextRequest) {
  try {
    const { reportId, status, address, addressComponents, landGeometry } = await req.json();

    // console.log("Get Report Data Recieved:", reportId, status, address, addressComponents, landGeometry);
      
    if ( !status || !reportId ) {
      return NextResponse.json({ message: 'Invalid request, missing details to get report data' }, { status: 400 });
    }

    if (status === ReportStatus.Unredeemed) {

      if (!landGeometry || !Array.isArray(landGeometry) || landGeometry.length < 3 || !address || !addressComponents) {
        return NextResponse.json({ message: 'Invalid request, missing details to redeem a report' }, { status: 400 });
      }
        
      // Reverse landGeometry points for earth engine
      const points = landGeometry.map(([a, b]) => [b, a]);

      await initializeEarthEngine();
      const polygon = ee.Geometry.Polygon(points);      

      // Download all data
      const unprocessedLandUseData = await fetchLandUseData(dataYears, polygon);
      const unprocessedClimateData = await fetchClimateData(dataYears, polygon);
      const unprocessedElevationData = await fetchElevationData(polygon);
      const unprocessedSoilData = await fetchSoilData(polygon);
      // const unprocessedCropData = await fetchCropData(polygon, dataYears);

      const landUseData = processLandUseData(unprocessedLandUseData);
      const climateData = processClimateData(unprocessedClimateData); //
      const elevationData = processElevationData(unprocessedElevationData); 
      const windData = processWindData(unprocessedElevationData,unprocessedClimateData);
      const soilData = processSoilData(unprocessedSoilData);
      const growingSeasonData = processGrowingSeasonData(unprocessedClimateData);
      const heatUnitData = processHeatUnitData(unprocessedClimateData);
      const cropData = null;
      
      // Process all data
      // To do later
        
      const bounds = await polygon.bounds().getInfo();
      const boundCoordinates = bounds.coordinates[0];
      const centroid = await polygon.centroid().getInfo();

      const redeemedAt = new Date().toISOString();
      // Note that we're switching from longitude first to latitude first for leaflet use here
      const data = { 
        reportId,
        latitude: centroid.coordinates[1],
        longitude: centroid.coordinates[0],
        address,
        addressComponents,
        landGeometry,
        status: ReportStatus.Redeemed,
        redeemedAt,
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
        cropData,
      };

      // // To save the data
      // const filePath = path.join(process.cwd(), 'downloadedData.json');

      // // Write the data to the JSON file
      // fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        
      // Save processed data to AWS S3
      const storeResponse = await storeReportInS3(data)
      if (!storeResponse.success) {
        throw new Error(storeResponse.message);
      }

      // Update report status in DynamoDB
      const result = await updateReportAttributes(reportId, {
        status: ReportStatus.Redeemed,
        redeemedAt,
      });
    
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
        
      return NextResponse.json(data, { status: 200 });
    } 

    else if (status === ReportStatus.Redeemed) {        
      const getResponse = await getReportFromS3(reportId);        
      if (!getResponse.success) {
        throw new Error(getResponse.message);
      }
        
      return NextResponse.json(getResponse.report, { status: 200 });
    }

    else {
      console.log("getReportData api route - this should not be possible");
      return NextResponse.json({ message: "This should not be possible, how did you get here?" }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

