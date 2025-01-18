import nodemailer from 'nodemailer';
import { updateUser } from '@/lib/database';
import crypto from 'crypto';

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Landwise Analytica" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function sendVerificationEmail(userId: string, email: string) {
  if (!userId || !email) {
    return { success: false, error: 'User ID and email are required.' };
  }

  const token = generateVerificationToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24-hour expiration
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?userId=${userId}&token=${token}`;

  console.log("Sending verification email to", userId, email, token, expires, verificationLink);

    
  // Update user with token and expiration
  const userUpdateResult = await updateUser(userId, {
    emailVerificationToken: token,
    emailVerificationTokenExpires: expires,
  });

  if (!userUpdateResult.success) {
    return { success: false, error: 'Failed to update user.' };
  }

  // Send verification email
  const emailResult = await sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html: `
        <div style="background-color: #FAF8F0; padding: 10px;">
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #FFFFFF;">
            <h2 style="text-align: center;">Email Verification</h2>
            <p style="text-align: center;">Thank you for signing up! Click the button below to verify your email address:</p>
            <p style="text-align: center; margin-top: 10px;">
              <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            </p>
            <p style="text-align: center; margin-top: 10px;">If you did not sign up, you can safely ignore this email.</p>
          </div>
        </div>
    `,
  });

  if (!emailResult.success) {
    return { success: false, error: 'Failed to send email.' };
  }

  return { success: true };
}

