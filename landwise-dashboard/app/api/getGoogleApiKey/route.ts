import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key is missing' }, { status: 500 });
  }

  return NextResponse.json({ apiKey }, { status: 200 });
}
