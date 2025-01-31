'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function SignUpForm() {
  const { data: session, status } = useSession();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [realtyGroup, setRealtyGroup] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!agreeToTerms) {
      setLoading(false);
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    try {
      const result = await signIn('signup', {
        email,
        password,
        firstName,
        lastName,
        realtyGroup,
        redirect: false,
      });

      console.log("Result:", result);

      if (result?.error) {
        setLoading(false);
        setError(result.error);
        return;
      }
      
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    console.log("(signup form)", session);
    if (status === 'authenticated' && session?.user?.email) {
      router.push('/dashboard');
    }
  }, [session, status]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-x-4">
        <div className="flex flex-col gap-y-2 w-1/2">
          <label htmlFor="firstName" className="text-sm font-medium dark:text-white">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            placeholder="Enter your first name"
          />
        </div>
        <div className="flex flex-col gap-y-2 w-1/2">
          <label htmlFor="lastName" className="text-sm font-medium dark:text-white">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            placeholder="Enter your last name"
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="email" className="text-sm font-medium dark:text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
          placeholder="Enter your email"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="password" className="text-sm font-medium dark:text-white">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
          placeholder="Enter your password"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="realtyGroup" className="text-sm font-medium dark:text-white">
          Realty Group
        </label>
        <input
          type="text"
          id="realtyGroup"
          value={realtyGroup}
          onChange={(e) => setRealtyGroup(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
          placeholder="Enter your realty group"
        />
      </div>
      <div className="flex items-center gap-x-2 ml-2">
        <input
          type="checkbox"
          id="agreeToTerms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="h-4 w-4 text-dark-blue border-gray-300 rounded"
        />
        <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-white">
          I agree to the{' '}
          <a href="/terms-of-service" target="_blank" className="text-dark-blue underline dark:text-medium-green">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" target="_blank" className="text-dark-blue underline dark:text-medium-green">
            Privacy Policy
          </a>
          .
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 font-semibold text-white bg-medium-brown dark:bg-medium-green rounded-md hover:opacity-75 ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-5 w-5 animate-spin text-white mr-2" />
            Signing up...
          </div>
        ) : (
          'Sign Up'
        )}
      </button>
    </form>
  );
}
