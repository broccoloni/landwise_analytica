'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import NotificationBanner from '@/components/NotificationBanner';
import { useSession } from 'next-auth/react';

const ourEmail = process.env.NEXT_PUBLIC_EMAIL_ADDRESS;

export default function FeedbackForm() {
  const { data: session, update } = useSession();

  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const name = `${session?.user?.firstName} ${session?.user?.lastName}`;
  const email = session?.user?.email;
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: ourEmail,
          subject: `Customer Feedback from ${name}`,
          text: `
            Name: ${name}
            Email: ${email}
            Feedback: ${feedback}
          `,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Feedback:</strong><br>${feedback}</p>
          `,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess('Thank you for your feedback!');
        setFeedback('');
      } else {
        throw new Error(result.message || 'Failed to send feedback');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl mb-4">We Value Your Feedback</h2>
      {error && (
        <div className="mb-4">
          <NotificationBanner type='error'>{error}</NotificationBanner>
        </div>
      )}
      {success && (
        <div className="mb-4">
          <NotificationBanner type='success'>{success}</NotificationBanner>
        </div>
      )}
        
      <div className="">Please provide your feedback below and help us improve.</div>

        
      <form className="space-y-6" onSubmit={handleSubmit}>
        <textarea
          id="feedback"
          name="feedback"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="If you have any feedback, suggestions, or features you wish to be included, please provide those details here."
          required
        />

        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-medium-brown py-2 px-4 text-sm font-medium text-white shadow-sm hover:opacity-75 dark:bg-medium-green"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
