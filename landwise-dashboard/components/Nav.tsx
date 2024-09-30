'use client';

import React from 'react';
import { montserrat, roboto } from '@/ui/fonts';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav className={`${roboto.className} w-1/6 bg-accent text-white h-screen py-8 px-2`}>
      <div className="text-center mb-4">
        <Link href="/" passHref>
          <span className={`${montserrat.className} text-2xl text-white font-medium`}>
            Landwise Analytica
          </span>
        </Link>
      </div>
      <ul className="space-y-2">
        <li>
          <a 
            href="#property" 
            className="block hover:bg-white hover:text-accent transition-colors duration-300 py-2 px-4 rounded"
          >
            Property
          </a>
        </li>
        <li>
          <a 
            href="#land-history" 
            className="block hover:bg-white hover:text-accent transition-colors duration-300 py-2 px-4 rounded"
          >
            Land History
          </a>
        </li>
        <li>
          <a 
            href="#trends" 
            className="block hover:bg-white hover:text-accent transition-colors duration-300 py-2 px-4 rounded"
          >
            Trends
          </a>
        </li>
        <li>
          <a 
            href="#agriculture-tips" 
            className="block hover:bg-white hover:text-accent transition-colors duration-300 py-2 px-4 rounded"
          >
            Agriculture Tips
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
