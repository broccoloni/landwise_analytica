import { NextResponse } from "next/server";
import { getReportsBySessionId } from "@/lib/database";

// Export a named function for POST
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    console.log("(api/getReports/bySessionId)", sessionId);

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "sessionId must be supplied.",
        },
        { status: 400 }
      );
    }

    const result = await getReportsBySessionId(sessionId);

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
