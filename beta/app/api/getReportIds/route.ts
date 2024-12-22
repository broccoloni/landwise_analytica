import { NextRequest, NextResponse } from 'next/server';
import { getReportIds } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionOrCustomerId } = body;

    if (!sessionOrCustomerId) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Missing sessionOrCustomerId in request body' }), { status: 400 });
    }

    const response = await getReportIds(sessionOrCustomerId);

    if (!response.success) {
      return new NextResponse(JSON.stringify({ success: false, message: response.message }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ success: true, reportIds: response.reportIds }), { status: 200 });
  } catch (error) {
    console.error("Error in getReportIds API route:", error);
    return new NextResponse(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
  }
}
