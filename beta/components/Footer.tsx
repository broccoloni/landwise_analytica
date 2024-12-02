'use client'; 

import { montserrat, roboto, merriweather, nunito, raleway } from '@/ui/fonts';
import Link from 'next/link';
import ListOfLinks from '@/components/ListOfLinks';

const Footer = () => {
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
    { label: "Banking, Insurance and Government", path: 'banking-insurance-government' },
  ];
    
  return (
    <div className={`w-full text-white bg-dark-brown py-24 px-40 ${raleway.className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ListOfLinks title="Reports" links={reportLinks} />
        <ListOfLinks title="Company" links={companyLinks} />
        <ListOfLinks title="Solutions" links={businessLinks} />
      </div>
      <div className="text-left mt-8 text-sm">
        © {new Date().getFullYear()} Landwise Analytica. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
