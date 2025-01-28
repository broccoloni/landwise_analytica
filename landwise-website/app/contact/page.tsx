'use client';

import { roboto, raleway } from '@/ui/fonts';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import NotificationBanner from '@/components/NotificationBanner';
import Container from '@/components/Container';
import Link from 'next/link';

const ourEmail = process.env.NEXT_PUBLIC_EMAIL_ADDRESS;

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
    
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [tab, setTab] = useState<'form' | 'direct'>('form');
    
  const employees = [
    {
      name: "Aman Bhullar",
      role: "Co-Founder",
      description: "PhD Candidate - Statistics",
      email: "bhullara@uoguelph.ca",
      image: "/employees/aman.png",
    },
    {
      name: "Patrick McMillan",
      role: "Co-Founder",
      description: "PhD Candidate - Bioinformatics",
      email: "pmcmilla@uoguelph.ca",
      image: "/employees/patrick.png",
    },
    {
      name: "Liam Graham",
      role: "Co-Founder",
      description: "MSc Computer Science, MSc Mathematics",
      email: "lgraham@landwiseanalytica.com",
      image: "/employees/liam.jpg",
    },
  ];

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
          subject: `${subject}`,
          text: `
            Name: ${name}
            Email: ${email}
            Message: ${message}
          `,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong><br>${message}</p>
          `,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess('Thank you contacting us, we\'ll get back to you shortly!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error(result.message || 'Failed to send message');
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
    <div 
      className={`flex-row py-20
        ${tab === 'form' ? 'px-80' : 'px-40'}
      `}
    >        

      <div className={`${roboto.className} text-3xl grid grid-cols-2 text-center space-x-4 mx-auto`}>
        <button 
          className={`rounded-t-xl px-4 py-2 border-t border-l border-r hover:bg-gray-100
            ${tab === 'form' ? 'bg-white' : 'bg-gray-200'}
          `}
          onClick={() => setTab('form')}
        >
            Contact Form
        </button>
        <button 
          className={`rounded-t-xl px-4 py-2 border-t border-l border-r hover:bg-gray-100
            ${tab === 'direct' ? 'bg-white' : 'bg-gray-200'}
          `}
          onClick={() => setTab('direct')}
        >
          Contact Us Directly
        </button>
      </div>
        
      {tab === 'form' ? (
        <Container className="flex flex-col py-8 space-y-8 bg-white">
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

            
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
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
                className="block text-sm font-medium text-gray-700"
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
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the subject of the message"
                required
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
               >
                 Message
               </label>
               <textarea
                 id="message"
                 name="message"
                 rows={4}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 placeholder="Please write your message here."
                 required
               />
             </div>

            <div>
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-medium-brown py-2 px-4 text-sm font-medium text-white shadow-sm hover:opacity-75"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        </Container>

      ) : (
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto justify-center items-start">
            {employees.map((person, index) => (
              <div
                key={index}
                className="flex border-y border-gray-500 py-8 mx-2 w-full bg-white h-lg"
              >
                <div className="ml-4 flex-shrink-0">
                  <Image
                    src={person.image}
                    width={150}
                    height={200}
                    alt={person.name}
                    className="rounded-lg border border-gray-300"
                  />
                </div>
                <div className="ml-8 mr-4 space-y-4 flex flex-col justify-start">
                  <div>
                    <div className={`${raleway.className} text-xl mb-2`}>{person.name}</div>
                    <div className={`${roboto.className} text-lg`}>{person.role}</div>
                    <div className="">{person.description}</div>
                  </div>
                  <div className="flex">
                    Email:
                    <div
                      className="ml-2 text-blue-700 hover:underline truncate"
                      title={person.email}
                    >
                      <Link
                        href={`mailto:${person.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                      >
                        {person.email}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>

      )}
    </div>
  );
}
