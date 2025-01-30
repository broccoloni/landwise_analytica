import { NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/database';
import { RealtorStatus } from '@/types/statuses';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  if (!userId || !token) {
    return NextResponse.json({ message: 'User ID and token are required' }, { status: 400 });
  }

  // Retrieve user by ID
  const user = await getUserById(userId);

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 404 });
  }

  if (user.status === RealtorStatus.Active) {
    return NextResponse.json({ message: 'Email already verified'}, { status: 201 });
  }

  const emailVerificationTokenExpires = user.emailVerificationTokenExpires;
  
  if (!emailVerificationTokenExpires || new Date(emailVerificationTokenExpires).toString() === 'Invalid Date') {
    return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
  }

  // Check if the token matches and is not expired
  if (
    user.emailVerificationToken !== token ||
    new Date(emailVerificationTokenExpires) < new Date()
  ) {
    return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
  }

  // Mark the user as verified
  const userUpdateResult = await updateUser(userId, {
    emailVerificationToken: '',
    emailVerificationTokenExpires: '',
    status: RealtorStatus.Active,
  });

  if (!userUpdateResult.success) {
    return NextResponse.json({ message: 'Failed to update user.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Email verified successfully!' }, { status: 200 });
}
