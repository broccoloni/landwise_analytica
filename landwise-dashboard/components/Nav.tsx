'use client';

import { montserrat, roboto, merriweather, nunito, raleway } from '@/ui/fonts';
import Link from 'next/link';
import { House, BookMarked, ChartNoAxesCombined, Wheat, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';
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
    label: 'Agriculture Tips',
    href: '#agriculture-tips',
    icon: Wheat,
  },
];

const Nav = React.memo(() => {
  const pathname = usePathname();
  const [showMobileNavItems, setShowMobileNavItems] = React.useState(false);

  const toggleMobileNav = React.useCallback(() => {
    setShowMobileNavItems((prev) => !prev);
  }, []);

  // Smooth scroll function
  const handleScroll = (event, href) => {
    event.preventDefault(); // Prevent the default anchor behavior
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setShowMobileNavItems(false); // Close mobile nav after selection
  };

  return (
    <div className="fixed z-50 flex-col bg-accent h-screen w-52 border-b-0 p-1 shadow-xl transition sm:flex sm:w-64 sm:p-3">
      <div className="flex items-center justify-between p-3 mb-4">
        <Link href="/">
          {/* Company Name and Logo */}
          <div className="flex-row justify-center items-center text-center w-full">
            <div className="flex justify-center w-full">
              <PlantInHandIcon className="" height={36} width={36} />
            </div>
            <p className={`${raleway.className} font-medium text-white text-center text-lg mt-2`}>
              LANDWISE ANALYTICA
            </p>
          </div>
        </Link>
        <button
          className="sm:hidden"
          onClick={toggleMobileNav}
          aria-label="Toggle Navigation"
        >
          <Menu />
        </button>
      </div>
      <nav className={`flex-1 p-2 pb-3 shadow-xl transition ${showMobileNavItems ? 'flex' : 'hidden'} sm:flex sm:p-0 sm:shadow-none`}>
        <ul className="flex-col w-full">
          {navigationMenuItems.map((item) => (
            <li key={item.label} className="flex-row justify-start items-center w-full p-1">
              <Link href={item.href}>
                <button
                  className={`text-lg focus:outline-none w-full`}
                  onClick={(event) => handleScroll(event, item.href)} // Updated to use handleScroll
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
});

export default Nav;
