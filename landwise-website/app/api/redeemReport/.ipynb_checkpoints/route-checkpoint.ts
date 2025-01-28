import { NextResponse } from 'next/server';
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
import { storeReportInS3, getReportFromS3, updateReportAttributes, getReportsById } from '@/lib/database';
import { 
  processHeatUnitData,
  processGrowingSeasonData,
  processClimateData, 
  processLandUseData, 
  processElevationData, 
  processWindData, 
  processSoilData 
} from '@/utils/dataProcessing';

// const dataYears = ['2014','2015','2016','2017', '2018', '2019', '2020', '2021', '2022','2023','2024'];
const dataYears = [2021, 2022];

export async function POST(request: Request) {
  try {
    const { reportId, address, addressComponents, landGeometry } = await request.json();
    
    if (!reportId) {
      return NextResponse.json({ message: 'Invalid request, missing details to get redeem report' }, { status: 400 });
    }
      
    const result = await getReportsById(reportId);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid reportId" }, { status: 400 });
    }

    const reports = result.reports;
    
    if (!reports || reports.length === 0) {
      return NextResponse.json({ message: "No reports found" }, { status: 400 });
    }
    
    const report = reports[0];
      
    if (report.status !== ReportStatus.Unredeemed) { 
      return NextResponse.json({ message: "Report is not in a unredeemed state - cannot redeem report", report }, { status: 400 });
    }

    if (!landGeometry || !Array.isArray(landGeometry) || landGeometry.length < 3 || !address || !addressComponents) {
      return NextResponse.json({ message: 'Invalid request, missing details to redeem a report' }, { status: 400 });
    }

    redeemReport(reportId, address, addressComponents, landGeometry);

    const statusUpdate = await updateReportAttributes(reportId, { status: ReportStatus.Processing });
    return NextResponse.json({ message: 'Processing started' }, { status: 200 });

  } catch (error) {
    console.error('Error in redeemReport route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

const redeemReport = async (reportId: string, address: string, addressComponents: any, landGeometry: number[][]) => {
  try {
    const result1 = await updateReportAttributes(reportId, { status: 'Beginning Processing' });
      
      const points = landGeometry.map(([a, b]) => [b, a]);
    
      await initializeEarthEngine();
      const polygon = ee.Geometry.Polygon(points);      

      const result2 = await updateReportAttributes(reportId, { status: 'Downloading Land Use History' });
      const unprocessedLandUseData = await fetchLandUseData(dataYears, polygon);
      if (!unprocessedLandUseData) {
        throw new Error("Land use data not found");
      }
      
      const result3 = await updateReportAttributes(reportId, { status: 'Downloading Climate History' });
      const unprocessedClimateData = await fetchClimateData(dataYears, polygon);
      if (!unprocessedClimateData) {
        throw new Error("Climate data not found");
      }
      
      const result4 = await updateReportAttributes(reportId, { status: 'Downloading Elevation Data' });
      const unprocessedElevationData = await fetchElevationData(polygon);
      if (!unprocessedElevationData) {
        throw new Error("Elevation data not found");
      }

      const result5 = await updateReportAttributes(reportId, { status: 'Downloading Soil Data' });
      const unprocessedSoilData = await fetchSoilData(polygon);
      if (!unprocessedSoilData) {
        throw new Error("Soil data not found");
      }
      
      const result6 = await updateReportAttributes(reportId, { status: 'Processing Data' });
      
      // Calculate area with ESPG that is equal area to get accurate area measurement
      // For the US: EPSG 5070, 
      const area = Math.round((polygon as any).area(0.1,'EPSG:5070').getInfo());
      
      const landUseData = processLandUseData(unprocessedLandUseData, area);
      const climateData = processClimateData(unprocessedClimateData);
      const elevationData = processElevationData(unprocessedElevationData); 
      const windData = processWindData(unprocessedElevationData, unprocessedClimateData);
      const soilData = processSoilData(unprocessedSoilData);
      const growingSeasonData = processGrowingSeasonData(unprocessedClimateData);
      const heatUnitData = processHeatUnitData(unprocessedClimateData);
      const cropData = ['Crop data string so that the below check for nonemptiness doesn\'t get triggered'];

      const result7 = await updateReportAttributes(reportId, { status: 'Finalizing Report' });
      const bounds = await polygon.bounds().getInfo();
      const boundCoordinates = bounds.coordinates[0];
      const centroid = await polygon.centroid().getInfo();


    
      const redeemedAt = new Date().toISOString();
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

      // Store report regardless of whether there is an error so we can see what 
      // data downloaded / was processed properly, and what wasn't
      
      const storeResponse = await storeReportInS3(data);
      if (!storeResponse.success) {
        throw new Error(storeResponse.message);
      }
      
      // Check to make sure everything in report is full
      if (heatUnitData && growingSeasonData && climateData && elevationData && landUseData && windData && soilData && cropData) {
        const result = await updateReportAttributes(reportId, {
          status: ReportStatus.Redeemed,
          address,
          redeemedAt,
          latitude: centroid.coordinates[1],
          longitude: centroid.coordinates[0],
        });
    
        if (result.success) {
          console.log(result.message);
        } else {
          console.error(result.message);
        }
      } else {
        const result = await updateReportAttributes(reportId, {
          status: ReportStatus.Error,
          address,
          latitude: centroid.coordinates[1],
          longitude: centroid.coordinates[0],
        });
    
        if (result.success) {
          console.log(result.message);
        } else {
          console.error(result.message);
        }
      }
  } catch (error) {
    console.error('Error redeeming report:', error);
    const result8 = await updateReportAttributes(reportId, { status: ReportStatus.Error });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
