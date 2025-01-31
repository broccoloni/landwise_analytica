'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function FaqsPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What services/products do you offer?',
      answer: (
        <>
          We provide land suitability reports to agriculture stakeholders.
        </>
      ),
    },
    {
      question: 'How do I order a report?',
      answer: (
        <>
          You can <span className='italic'>Order</span> a report by navigating with the top-menu to{' '}
          <strong>Get a Report</strong>. Once purchased, you'll be emailed your
          report ID(s) that you can then redeem under the{' '}
          <strong>Redeem a Report</strong> page.
          <br /><br />
          If you have an account, you can order your reports be navigating to the{' '}
          <strong>Reports</strong> tab, and clicking on{' '} <strong>Order a New Report</strong>
        </>
      ),
    },
    {
      question: 'How and what do I need to redeem my report?',
      answer: (
        <>
          You can <span className='italic'>Redeem</span> a report by navigating with the top-menu to{' '}
          <strong>Redeem a Report</strong>. You will need to provide:<br />
          <ul className="list-disc ml-2">
            <li className="ml-5">A report ID that you've purchased</li>
            <li className="ml-5">The address of where you'd like to redeem the report</li>
            <li className="ml-5">A Perimeter of the property</li>
          </ul>
        </>
      ),
    },
    {
      question: 'How do I view my report?',
      answer: (
        <>
          You can <span className='italic'>View</span> a report by navigating with the top-menu to{' '}
          <strong>View a Report</strong> and will need to provide a report ID that you've redeemed.
        </>
      ),
    },
    {
      question: 'How does a report expire?',
      answer: (
        <>
          Reports expire 180 days after they've been redeemed. Once this happens we cannot guaruntee that
          the report will be stored, and you may no longer be able to view your report from our systems.
          Before expiration, be sure to download your report if you wish to keep viewing it.
        </>
      ),
    },
    {
      question: 'How can I view my report after it has expired?',
      answer: (
        <>
          Before your report expires, you can download it in one of two formats, PDF and JSON. The PDF 
          version of our reports is static. If you prefer the dynamic aspects of our online report viewer,
          you can download your report in JSON format, and upload it for dynamic viewing {' '}
          <Link
            href='/upload'
            className="hover:text-medium-brown hover:underline"
          >
            here
          </Link>
        </>
      ),
    },
    {
      question: 'What does an account provide?',
      answer: (
        <>
          With an account, you get access to our report management system. When ordering reports through the{' '}
          <strong>My Reports</strong> tab, you'll be able to quickly and easily view the reports you've ordered,
          along with their redemption information and expiry. 
          <br /><br />
          Account holder also enjoy additional discounts when ordering more reports on a monthly basis. 
          
        </>
      ),
    },
    {
      question: 'What does your data come from?',
      answer: (
        <>
          We get our data from a combination of sources, including Google Earth Engine, Canada's annual crop inventory data, and Statistics Canada. 
          We use this data with our proprietary machine-learning models to provide you with the information you see in the reports.
          
        </>
      ),
    },
  ];

  const toggleQuestion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              className="w-full text-left px-4 py-3 bg-white hover:bg-gray-200 dark:bg-dark-gray-c dark:hover:bg-dark-gray-d focus:outline-none focus:ring-2 focus:ring-medium-brown dark:focus:ring-medium-green"
              onClick={() => toggleQuestion(index)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-all ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {activeIndex === index && (
              <div className="px-4 py-3 text-gray-700 bg-white dark:bg-dark-gray-c dark:text-white border-t">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-white">
          Can't find the answer you're looking for?{' '}
          <Link
            href="/feedback" 
            className="text-medium-brown dark:text-medium-green font-medium hover:underline"
          >
            Submit your feedback
          </Link>{' '}
          and we'll get back to you as soon as possible.
        </p>
      </div>
    </div>
  );
}
