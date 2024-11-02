'use client';

import { montserrat, roboto, merriweather, nunito, raleway } from '@/ui/fonts';
import Link from 'next/link';
import { House, BookMarked, ChartNoAxesCombined, Wheat, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { MouseEvent } from 'react';
import PlantInHandIcon from '@/components/PlantInHandIcon';

const navigationMenuItems = [
  {
    label: 'Property',
    href: '#property',
    icon: House,
  },
  {
    label: 'Historical Land Use',
    href: '#land-history',
    icon: BookMarked,
  },
  {
    label: 'Trends',
    href: '#trends',
    icon: ChartNoAxesCombined,
  },
  {
    label: 'Agriculture Insights',
    href: '#agriculture-insights',
    icon: Wheat,
  },
];

const Nav = () => {
  const pathname = usePathname();
  const [showMobileNavItems, setShowMobileNavItems] = React.useState(false);

  const handleScroll = (event: MouseEvent<HTMLButtonElement>, href: string) => {
    event.preventDefault(); // Prevent the default anchor behavior
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setShowMobileNavItems(false); // Close mobile nav after selection
  };
    
  return (
    <div className="fixed z-50 w-full flex-col bg-accent sm:fixed sm:flex sm:h-screen sm:w-52 sm:border-b-0 sm:p-1 lg:w-64 lg:p-3">
      <div className="flex items-center justify-center w-full p-3 sm:mb-4">
        <div className="w-0 sm:w-20 sm:hidden"></div>
        <div className="flex justify-center items-center w-full">
          <Link className="w-full" href="/">
            {/* Company Name and Logo */}
            <div className="flex-row justify-center items-center text-center w-full">
              <div className="flex justify-center w-full">
                <PlantInHandIcon className="" height={36} width={36} />
              </div>
              <p className={`${raleway.className} font-medium text-white text-center sm:text-lg text-3xl mt-2`}>
                LANDWISE ANALYTICA
              </p>
            </div>
          </Link>
        </div>
        <div className="flex justify-center items-center sm:w-20 sm:hidden">
          <button
            className=""
            onClick={() => setShowMobileNavItems(!showMobileNavItems)}
          >
            <Menu className="w-10 h-10"/>
          </button>
        </div>
      </div>
      <nav
        className={`${showMobileNavItems ? 'flex' : 'hidden'} w-full flex-1 p-2 pb-3 shadow-xl transition sm:flex sm:p-0 sm:shadow-none`}
      >
        <ul className="w-full flex-col">
          {navigationMenuItems
            .map((item) => (
              <li key={item.label} className="p-1">
                <Link href={item.href}>
                  <button
                    className={`w-full justify-start text-lg text-accent rounded-lg hover:bg-accent-light`}
                    onClick={(event) => handleScroll(event, item.href)}
                    tabIndex={-1}
                  >
                    <div className="flex justify-start items-center text-white hover:bg-accent-light hover:text-accent-dark rounded-lg w-full px-4 py-2">
                      <item.icon className="mr-2" size={20} />
                      {item.label}
                    </div>
                  </button>
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default Nav;



