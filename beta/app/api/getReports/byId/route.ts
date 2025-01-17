import { NextResponse } from "next/server";
import { getReportsById } from "@/lib/database";

// Export a named function for POST
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId } = body;

    console.log("(api/getReports/byId)", reportId);

    if (!reportId) {
      return NextResponse.json(
        {
          success: false,
          message: "reportId must be supplied.",
        },
        { status: 400 }
      );
    }

    const result = await getReportsById(reportId);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 404 });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Internal server error: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}
