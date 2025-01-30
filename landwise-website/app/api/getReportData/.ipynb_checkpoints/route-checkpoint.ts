import { NextRequest, NextResponse } from 'next/server';
import { ReportStatus } from '@/types/statuses'; 
import { getReportFromS3, getReportsById } from '@/lib/database';


export async function POST(req: NextRequest) {
  try {
    const { reportId } = await req.json();

    // console.log("Get Report Data Recieved:", reportId, status, address, addressComponents, landGeometry);
      
    if ( !reportId ) {
      return NextResponse.json({ message: 'Invalid request, missing details to get report data' }, { status: 400 });
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

    if (report.status !== ReportStatus.Redeemed) { 
      return NextResponse.json({ message: "Report is not in a redeemed state - cannot fetch report data", report }, { status: 400 });
    }
    
    const getResponse = await getReportFromS3(reportId);        
    if (!getResponse.success) {
      throw new Error(getResponse.message);
    }
      
    return NextResponse.json({ report: getResponse.report }, { status: 200 });

  } catch (error) {
    console.error('Error in getReportData route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

