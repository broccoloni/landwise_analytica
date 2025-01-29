import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("reportId");

  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  const data = {
    reportId,
    message: "This is your dynamically generated report",
    timestamp: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(data, null, 2);

  return new NextResponse(jsonString, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="report-${reportId}.json"`,
    },
  });
}
