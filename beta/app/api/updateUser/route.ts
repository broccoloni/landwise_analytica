import { NextResponse } from 'next/server';
import { updateUser } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { id, updates } = await request.json();
    const result = await updateUser(id, updates);

    if (result.success) {
      return NextResponse.json({ message: result.message, data: result.data });
    } else {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
