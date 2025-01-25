'use client';

import Link from 'next/link';
import { abhaya } from '@/ui/fonts';
import { useReportContext } from '@/contexts/ReportContext';
import Image from 'next/image';

const Logo = () => {
  const { clearReportContext } = useReportContext();

  return (
    <Link href="/" >
      <div className="flex items-center">
        <Image
          src='/logos/LandwiseSymbol.png'
          alt='Landwise Analytica Logo'
          width={64}
          height={64}
        />
        <div className={`${abhaya.className} flex-row justify-center items-center ml-4`}>
          <div className="text-2xl text-center" style={{ letterSpacing: '0.2em' }}>LANDWISE</div>
          <div className="text-xs text-center" style={{ letterSpacing: '0.5em' }}>ANALYTICA</div>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
