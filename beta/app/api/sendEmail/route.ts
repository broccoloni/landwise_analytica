import { sendEmail } from '@/utils/sendEmail';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { to, subject, text, html } = await req.json();

  if (!to || !subject || (!text && !html)) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  const result = await sendEmail({ to, subject, text, html });

  if (result.success) {
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: result.error || 'Failed to send email' },
      { status: 500 }
    );
  }
}
