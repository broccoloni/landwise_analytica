'use client'; 

import { montserrat, roboto, merriweather, nunito, raleway } from '@/ui/fonts';
import Link from 'next/link';
import PlantInHandIcon from '@/components/PlantInHandIcon';
import DropdownMenu from '@/components/DropdownMenu';

const Header = () => {
  const reportOptions = [
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

  return (
    <div className={`w-full text-white bg-dark-olive py-4 px-36 ${raleway.className}`}>
      <div className="flex justify-between items-center text-center">
        <Link href="/">
          <div className="flex items-center">
            <div className="flex justify-center mr-4">
              <PlantInHandIcon className="" height={40} width={40} />
            </div>
            <div className={`font-medium text-center text-2xl`}>
              LANDWISE ANALYTICA
            </div>
          </div>
        </Link>
        <div className="">
          <DropdownMenu title="Our Reports" options={reportOptions} />
          <DropdownMenu title="Our Company" options={companyLinks} />
        </div>
      </div>
    </div>
  );
}

export default Header;
