import { NextRequest, NextResponse } from 'next/server';
import { createReport } from '@/lib/database';
import { ReportStatus } from '@/types/statuses';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionOrCustomerId } = body;

    console.log("Creating report for:", sessionOrCustomerId);
      
    if (!sessionOrCustomerId) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Missing sessionOrCustomerId in request body' }), { status: 400 });
    }

    const response = await createReport(sessionOrCustomerId);

    if (!response.success) {
      return new NextResponse(JSON.stringify({ success: false, message: `Failed to create report for ${sessionOrCustomerId}: ${response.message}` }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ success: true, reportId: response.reportId }), { status: 200 });
  } catch (error) {
    console.error("Error in getReportIds API route:", error);
    return new NextResponse(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
  }
}