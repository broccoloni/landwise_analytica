import { NextRequest, NextResponse } from 'next/server';
import { getReportAttributesById } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId } = body;

    if (!reportId) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Missing reportId in request body' }), { status: 400 });
    }

    const response = await getReportAttributesById(reportId);

    if (!response.success) {
      return new NextResponse(JSON.stringify({ success: false, message: response.message || "Invalid report ID" }), { status: 200 });
    }

    return new NextResponse(JSON.stringify({ success: true, report: response.report }), { status: 200 });
  } catch (error) {
    console.error("Error in getReportAttributes API route:", error);
    return new NextResponse(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
  }
}
