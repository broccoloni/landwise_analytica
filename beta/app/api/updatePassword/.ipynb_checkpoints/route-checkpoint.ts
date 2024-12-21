import { NextResponse } from 'next/server';
import { updateUser, getUserById, verifyHash } from '@/lib/database';

export async function POST(request: Request) {
  try {
    // Get the request body as JSON
    const { id, currentPassword, newPassword, confirmPassword } = await request.json();
  
    // Validate that all required fields are present
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Ensure the new passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords don't match" }, { status: 400 });
    }

    // Ensure the ID is present
    if (!id) {
      return NextResponse.json({ message: 'ID not found in session' }, { status: 400 });
    }

    // Retrieve the user from the database
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    // Verify the current password
    const validPassword = verifyHash(currentPassword, user.password);
    if (!validPassword) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 400 });
    }

    // Update the user's password
    const result = await updateUser(id, { password: newPassword });

    // Return the success response if the update is successful
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
