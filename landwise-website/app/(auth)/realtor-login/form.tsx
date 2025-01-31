'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log("Attempting login for user:", email, password); 
    try {
      const result = await signIn('signin', {
        email,
        password,
        redirect: false,
      });

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
    if (status === 'authenticated' && session?.user?.email) {
      router.push('/dashboard/');
    }
  },[session, status]);
    
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
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
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 font-semibold text-white bg-medium-brown rounded-md hover:opacity-75 dark:bg-medium-green ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center">      
            <Loader2 className="h-5 w-5 animate-spin text-white mr-2" />
            Logging In...
          </div>
        ) : ( 
          'Log In'
        )}
      </button>
    </form>
  );
}
