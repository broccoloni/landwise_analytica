'use client';

import { useState } from 'react';

export default function Faqs() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What services/products do you offer?',
      answer:
        'We offer a wide range of products including A, B, and C. Our services include X, Y, and Z to meet your needs.',
    },
    {
      question: 'How do I place an order?',
      answer: 'You can place an order by visiting our website and following the steps on the product page.',
    },
    {
      question: 'What is your return policy?',
      answer: 'Our return policy allows returns within 30 days of purchase. Please contact support for assistance.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship internationally. Shipping costs and delivery times may vary by location.',
    },
    {
      question: 'Why?',
      answer: 'Yes',
    },
    
  ];

  const toggleQuestion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="">
      <h2 className="text-2xl mb-4 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-medium-brown"
              onClick={() => toggleQuestion(index)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{faq.question}</span>
                <span>{activeIndex === index ? '-' : '+'}</span>
              </div>
            </button>
            {activeIndex === index && (
              <div className="px-4 py-3 text-gray-700 bg-white border-t">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Can't find the answer you're looking for?{' '}
          <a href="#" className="text-medium-brown font-medium hover:underline">
            Submit your feedback
          </a>{' '}
          and we'll get back to you as soon as possible.
        </p>
      </div>
    </div>
  );
}
