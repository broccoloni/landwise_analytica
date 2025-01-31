'use client';

import { raleway } from '@/ui/fonts';
import Link from 'next/link';
import ListOfLinks from '@/components/ListOfLinks';
import { useState, useEffect } from 'react';
import { useReportContext } from '@/contexts/ReportContext';

const Footer = () => {
  const { clearReportContext } = useReportContext();
    
  const [currentYear, setCurrentYear] = useState<string | null>(null);

  useEffect(() => {
    // Set the current year only after client-side rendering
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

    
  const [currentOpenMenu, setCurrentOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setCurrentOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleLinkClick = () => {
    clearReportContext();
    setCurrentOpenMenu(null);
  };

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
    { label: "Realtor Login", path: "/realtor-login" },
    { label: "Become A Realtor Member", path: "/realtor-signup" },
    { label: "Banking, Insurance & Government", path: "/banking-insurance-government" },
  ];

  return (
    <div className={`w-full text-white bg-dark-brown dark:bg-dark-gray-a py-10 sm:py-24 px-10 md:px-20 lg:px-40 ${raleway.className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-8">
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

      <div className="text-left mt-8 text-sm">
        © {currentYear} Landwise Analytica. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
