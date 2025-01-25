import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/utils/sendEmail';

export async function POST(request: Request) {
  const { email, userId } = await request.json();

  if (!email || !userId) {
    return NextResponse.json({ message: 'Email and userId are required.' }, { status: 400 });
  }

  const result = await sendVerificationEmail(userId, email);

  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Verification email sent.' }, { status: 200 });
}
