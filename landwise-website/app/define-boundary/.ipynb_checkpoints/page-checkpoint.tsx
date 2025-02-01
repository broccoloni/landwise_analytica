'use client';

import { roboto } from '@/ui/fonts';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import { useReportContext } from '@/contexts/ReportContext';
import { calculatePolygonArea } from '@/utils/calculateArea';
import { ArrowRight } from 'lucide-react';

// Dynamically import MapDrawing for client-side rendering
const MapDrawing = dynamic(() => import('@/components/MapDrawing'), { ssr: false });

export default function DefineBounrdary() {
  const router = useRouter();
  const { latitude, longitude, landGeometry, setLandGeometry, reportSize, setReportSize } = useReportContext();

  const stepNames = ['Select Address', 'Define Boundary', 'Purchase Report'];

  const handleGetReport = () => {
    router.push(`/get-a-report?size=${reportSize}`);
  };

  return (
    <div className={`${roboto.className} min-h-screen py-10 flex-row justify-between`}>
      <div className="mx-auto px-5 sm:px-20 md:px-40 lg:px-60 xl:px-80 py-10">
        <div className="text-4xl font-bold mb-8 text-center">Your Almost There!</div>
        <div className="mb-8 w-full">
          <ProgressBar currentStep={2} totalSteps={stepNames.length} stepNames={stepNames} />
        </div>
          
        <div className="text-2xl font-semibold mb-4">Define The Property Boundary</div>
        <ul className="mb-8 mx-8 space-y-2 text-dark-blue dark:text-white list-disc">
          <li className="">Click to add a boundary point</li>
          <li className="">Double-click to close the boundary</li>
          <li className="">Use the cursor to move points, if necessary</li>
        </ul>

        <div className="w-full">
          <MapDrawing
            latitude={latitude}
            longitude={longitude}
            zoom={15}
            points={landGeometry}
            setPoints={setLandGeometry}
            size={reportSize}
            setSize={setReportSize}
          />
        </div>

        <div className="flex justify-end w-full">
          <div className="">            
            <button
              onClick={handleGetReport}
              disabled={landGeometry.length < 3}
              className="flex justify-center items-center mt-4 bg-medium-brown dark:bg-medium-green text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
            >
              Get My Report
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
