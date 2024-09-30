'use client';

import { montserrat, roboto, merriweather } from '@/ui/fonts';
import Image from "next/image";
import Wheat from '@/public/wheat.jpg';
import AddressSearch from '@/components/AddressSearch';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <Image
        src={Wheat}
        alt="Background Image"
        fill 
        className="object-cover z-[-2]"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-black/20 z-[-1]" />

      {/* Centered Text */}
      <div className="flex items-center justify-center h-full">
        <div className="flex-row justify-center items-center">
          <div className={`${montserrat.className} font-medium text-white text-8xl z-10 pb-10`}>
            Landwise Analytica
          </div>
          <AddressSearch /> 
          <div className="flex items-center justify-center">
            <button className="items-center pt-10">
              <div className = "flex bg-accent py-2 px-4 rounded-lg">
                Use Demo Address
                <ArrowRight className="ml-2" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
