'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import Dropdown from '@/components/Dropdown';

export default function BankInsuranceGovernment() {
  const [industry, setIndustry] = useState('Please Specify');
  const [otherIndustry, setOtherIndustry] = useState('');

  return (
    <Container className="flex flex-col mx-auto max-w-2xl my-10 py-8 space-y-8 bg-white">
      <div className="text-4xl font-bold">Banks, Insurance, and Government</div>
      <div className="">Please provide your information below and we'll get back to you.</div>
      <form className="space-y-6">
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
              options={['Credit Union','Bank','Insurance Provider','Government','Other']}
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
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-medium-brown py-2 px-4 text-sm font-medium text-white shadow-sm hover:opacity-75"
          >
            Submit
          </button>
        </div>
      </form>
    </Container>
  );
}
