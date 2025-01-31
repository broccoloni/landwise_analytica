'use client';

import { useState, useEffect } from 'react';
import { montserrat, roboto, merriweather, nunito, raleway, abhaya } from '@/ui/fonts';
import Link from 'next/link';
import PlantInHandIcon from '@/components/PlantInHandIcon';
import DropdownMenu from '@/components/DropdownMenu';
import { Menu } from 'lucide-react';
import ListOfLinks from '@/components/ListOfLinks';
import { useReportContext } from '@/contexts/ReportContext';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import SubHeader from '@/components/SubHeader';
import Logo from '@/components/Logo';
import ThemeButton from '@/components/ThemeButton';

const Header = () => {
  const { data: session, status } = useSession();

  const { clearReportContext } = useReportContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentOpenMenu, setCurrentOpenMenu] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false); // Track if the component is mounted

  useEffect(() => {
    // Mark the component as mounted after the initial render
    setIsMounted(true);
  }, []);

  // Prevent rendering mobile menu logic before component mounts to avoid hydration errors
  if (!isMounted) {
    return null;
  }

  const reportLinks = [
    { label: "Why Buy a Report", path: "/why-buy-a-report" },
    { label: "Get a Report", path: "/get-a-report" },
    { label: "Redeem a Report", path: "/redeem-a-report" },
    { label: "View a Redeemed Report", path: "/view-report" },
    { label: "View a Sample Report", path: "/view-sample-report" },
    { label: "View a Downloaded Report", path: "/view-downloaded-report" },
  ];

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms-of-service" },
    { label: "FAQs", path: "/faqs" },
    { label: "Feedback", path: "/feedback" },
  ];

  const businessLinks = [
    { label: "Realtor Login", path: '/realtor-login' },
    { label: "Become A Realtor Member", path: 'realtor-signup' },
    { label: "Banking, Insurance & Government", path: 'banking-insurance-government' },
  ];

  const toggleMenu = (menu: string) => {
    setCurrentOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const handleLinkClick = () => {
    clearReportContext();
    setMobileMenuOpen(false);
    setCurrentOpenMenu(null);
  };

  return (
    <>
      <div className={`w-full text-white bg-dark-olive dark:bg-dark-gray-a pt-4 lg:px-20 xl:px-36 ${raleway.className}`}>
        {/* Desktop Header */}
        <div className="flex justify-between items-center pb-4 px-4">
          <Logo />

          {/* Desktop Dropdown Menus */}
          <div className="hidden md:flex">
            <div className="min-w-40">
              <DropdownMenu title="Our Reports" options={reportLinks} onLinkClick={handleLinkClick} />
            </div>
            <div className="min-w-40">
              <DropdownMenu title="Our Company" options={companyLinks} onLinkClick={handleLinkClick} />
            </div>
            <div className="min-w-40">
              <DropdownMenu title="Our Solutions" options={businessLinks} onLinkClick={handleLinkClick} />
            </div>
            <ThemeButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <Menu size={32} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-light-brown dark:bg-black absolute z-10 w-full">
            <div className="bg-dark-olive dark:bg-dark-gray-c dark:text-white opacity-80 grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-8">
              <ListOfLinks
                title="Reports"
                links={reportLinks}
                isOpen={currentOpenMenu === "reports"}
                onClick={() => toggleMenu("reports")}
                onLinkClick={handleLinkClick}
              />
              <ListOfLinks
                title="Company"
                links={companyLinks}
                isOpen={currentOpenMenu === "company"}
                onClick={() => toggleMenu("company")}
                onLinkClick={handleLinkClick}
              /> 
              <ListOfLinks
                title="Solutions"
                links={businessLinks}
                isOpen={currentOpenMenu === "solutions"}
                onClick={() => toggleMenu("solutions")}
                onLinkClick={handleLinkClick}
              />
              <div className="flex justify-between items-center mx-4 my-2">
                <div className="font-bold">Theme</div>
                <ThemeButton />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white">
        {status !== 'loading' && (
          <SubHeader />
        )}
      </div>
    </>
  );
};

export default Header;
