'use client';

import { montserrat, roboto, merriweather, nunito, raleway } from '@/ui/fonts';
import Image from "next/image";
import Wheat from '@/public/wheat.jpg';
import PlantInHandIcon from '@/components/PlantInHandIcon';
import AddressSearch from '@/components/AddressSearch';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { basePath } = publicRuntimeConfig || {};

export default function Home() {
  const router = useRouter();

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    router.push(`${basePath}/analysis?address=${encodeURIComponent(address)}&lat=${lat}&lng=${lng}`);
  };

  const handleDemoAddress = () => {
    const demoAddress = "8159 Side Road 30, Wellington County, Ontario, N0B 2K0, Canada";
    const lat = 43.6929954;
    const lng = -80.3071343;
    handleAddressSelect(demoAddress, lat, lng);
  };

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


      {/* Company Name and Logo */}
      <div className="flex-row justify-center items-center text-center w-full pt-12">
        <div className = "flex justify-center w-full">
          <PlantInHandIcon className="" height={96} width = {96}/>
        </div>
        <p className = {`${raleway.className} font-medium text-white text-6xl mt-2`}>
          LANDWISE ANALYTICA
        </p>
      </div>   
        
      <div className="absolute inset-0 flex items-center justify-center w-full"> 
        <div className="flex-row w-full justify-center">
          <div className="flex items-center justify-center px-4">
            <AddressSearch onAddressSelect={handleAddressSelect} prompt="Search for an address" /> 
          </div>
              
          <div className="flex items-center justify-center">
            <button className="items-center pt-10" onClick={handleDemoAddress}>
              <div className="flex bg-accent text-white py-2 px-4 rounded-lg">
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
