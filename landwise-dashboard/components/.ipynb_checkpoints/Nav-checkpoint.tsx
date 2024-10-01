'use client';

import { montserrat, roboto } from '@/ui/fonts';
import Link from 'next/link';
import { House, BookMarked, ChartNoAxesCombined, Wheat, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const navigationMenuItems = [
  {
    label: 'Property',
    href: '#property',
    icon: House,
  },
  {
    label: 'Land History',
    href: '#land-history',
    icon: BookMarked,
  },
  {
    label: 'Trends',
    href: 'trends',
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

  return (
    <div className="fixed z-50 flex-col bg-accent h-screen w-64 border-b-0 p-1 shadow-xl transition sm:flex sm:w-72 sm:p-3">
      <div className="flex items-center justify-between p-3 mb-4">
        <Link href="/">
          <div className="flex items-center gap-3 text-xl font-medium">
            <div className={`${montserrat.className} text-2xl text-white`}>
              Landwise Analytica
            </div>
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
                  onClick={() => setShowMobileNavItems(false)}
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
