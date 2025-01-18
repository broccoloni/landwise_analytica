'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import Dropdown from '@/components/Dropdown';
import { CircleAlert, CircleCheck } from 'lucide-react';

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
          to: 'lgraham@landwiseanalytica.com',
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl my-10">
      {error && (
        <Container className="mb-4 bg-red-50 text-red-800 py-2">
          <div className="flex justify-start items-center">
            <CircleAlert className="h-10 w-10 mr-8" />
            <div className="">{error}</div>
          </div>
        </Container>
      )}
      {success && (
        <Container className="mb-4 bg-green-50 text-green-800 py-2">
          <div className="flex justify-start items-center">
            <CircleCheck className="h-10 w-10 mr-8" />
            <div className="">{success}</div>
          </div>
        </Container>
      )}
      <Container className="flex flex-col py-8 space-y-8 bg-white">
        <div className="text-4xl font-bold">Banks, Insurance, and Government</div>
        <div>Please provide your information below and we'll get back to you.</div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          {/* Industry Dropdown */}
          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700"
            >
              Industry
            </label>
            <Dropdown
              id="industry"
              name="industry"
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
                className="block text-sm font-medium text-gray-700"
              >
                Please Specify Your Industry
              </label>
              <input
                type="text"
                id="otherIndustry"
                name="otherIndustry"
                value={otherIndustry}
                onChange={(e) => setOtherIndustry(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="md:col-span-2">
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
              required
            />
          </div>

          {/* Phone Number (Optional) */}
          <div className="md:col-span-2">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Textbox for Details */}
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700"
          >
            How can we help you? Describe the problem you are seeking to resolve.
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:border-medium-brown focus:ring-medium-brown"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
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
    </div>
  );
}
