'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import Dropdown from '@/components/Dropdown';
import NotificationBanner from '@/components/NotificationBanner';

const ourEmail = process.env.NEXT_PUBLIC_EMAIL_ADDRESS;

export default function BankInsuranceGovernment() {
  const [industry, setIndustry] = useState('Please Specify');
  const [otherIndustry, setOtherIndustry] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [details, setDetails] = useState('');
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
          subject: 'New Inquiry - Banking, Insurance, Government',
          text: `
            First Name: ${firstName}
            Last Name: ${lastName}
            Company Name: ${companyName}
            Industry: ${industry === 'Other' ? otherIndustry : industry}
            Email: ${email}
            Phone: ${phoneNumber || 'N/A'}
            Details: ${details}
          `,
          html: `
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName}</p>
            <p><strong>Company Name:</strong> ${companyName}</p>
            <p><strong>Industry:</strong> ${industry === 'Other' ? otherIndustry : industry}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phoneNumber || 'N/A'}</p>
            <p><strong>Details:</strong><br>${details}</p>
          `,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // Reset the form or show success message
        setSuccess("Inquiry sent successfully");
      } else {
        throw new Error(result.message || 'Failed to send email');
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
        <div className="text-4xl dark:text-medium-green">Banks, Insurance, and Government</div>
        <div>Please provide your information below and we'll get back to you.</div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter the name of your company"
              required
            />
          </div>

          {/* Industry Dropdown */}
          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Industry
            </label>
            <Dropdown
              options={['Credit Union', 'Bank', 'Insurance Provider', 'Government', 'Other']}
              selected={industry}
              onSelect={(selected) => setIndustry(selected)}
              className="px-auto"
            />
          </div>

          {/* Other Industry Input */}
          {industry === 'Other' && (
            <div className="md:col-span-2">
              <label
                htmlFor="otherIndustry"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Please Specify Your Industry
              </label>
              <input
                type="text"
                id="otherIndustry"
                name="otherIndustry"
                value={otherIndustry}
                onChange={(e) => setOtherIndustry(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
                placeholder="Enter the industry of your company"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="md:col-span-2">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone Number (Optional) */}
          <div className="md:col-span-2">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Textbox for Details */}
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            How can we help you? Describe the problem you are seeking to resolve.
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown dark:text-black"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Write the details of your inquiry here"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
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
      </Container>
    </div>
  );
}
