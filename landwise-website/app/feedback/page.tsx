'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import Dropdown from '@/components/Dropdown';
import NotificationBanner from '@/components/NotificationBanner';
import Loading from '@/components/Loading';

const ourEmail = process.env.NEXT_PUBLIC_EMAIL_ADDRESS;

export default function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
    
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
    
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
          subject: `Feedback from ${name}`,
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
        setName('');
        setEmail('');
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
    <div className="mx-auto max-w-2xl my-10">
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
      <Container className="flex flex-col py-8 space-y-8 bg-white dark:bg-dark-gray-c">
        <div className="text-4xl dark:text-medium-green">We'd Appreciate Your Feedback</div>
        <div>If you have any feedback for us or features you wish would be included, you can provide that here.</div>

        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="If you have any feedback for us or features you wish would be included, please write it here."
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center text-center rounded-md border border-transparent bg-medium-brown dark:bg-medium-green text-sm font-medium text-white shadow-sm hover:opacity-75 px-4 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  {/* <Loading className="h-5 w-5 text-white" /> */}
                  Sending...
                </>
              ) : (
                <div>Submit</div>
              )}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
