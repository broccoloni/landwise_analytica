'use client';

import { useState } from 'react';
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

const Header = () => {
  const {data: session, status} = useSession();
    
  const { clearReportContext } = useReportContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentOpenMenu, setCurrentOpenMenu] = useState<string | null>(null);

  const reportLinks = [
    { label: "Why Buy a Report", path: "/why-buy-a-report" },
    { label: "View a Sample Report", path: "/view-sample-report" },
    { label: "Get a Report", path: "/get-a-report" },
    { label: "Redeem a Report", path: "/redeem-a-report" },
    { label: "View an Existing Report", path: "/view-an-existing-report" },
  ];

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms-of-service" },
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
      <div className={`w-full text-white bg-dark-olive pt-4 md:px-20 lg:px-36 ${raleway.className}`}>
        {/* Desktop Header */}
        <div className="flex justify-between items-center pb-4 px-4">
          <Link 
            href="/"
            onClick={handleLinkClick}
          >
            <div className="flex items-center">
              <Image
                src='/logos/LandwiseSymbol.png'
                alt='Landwise Analytica Logo'
                width={64}
                height={64}
                className=""
              />
              <div className={`${abhaya.className} flex-row justify-center items-center ml-4`}>
                <div className="text-2xl text-center" style={{ letterSpacing: '0.2em' }}>LANDWISE</div>
                <div className="text-xs text-center" style={{ letterSpacing: '0.5em' }}>ANALYTICA</div>
              </div>
              {/* <div className="flex justify-center mr-4">
                <PlantInHandIcon height={40} width={40} />
              </div>
              <div className="font-medium text-left text-2xl">
                LANDWISE ANALYTICA
              </div> */}
            </div>
          </Link>

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
          <div className="sm:hidden bg-light-brown absolute z-10 w-full">
            <div className="bg-dark-olive opacity-80 grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-8">
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
            </div>
          </div>
        )}
      </div>
      <div className="bg-white">
        <SubHeader />
      </div>
    </>
  );
};

export default Header;
