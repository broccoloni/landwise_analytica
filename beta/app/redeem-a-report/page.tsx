'use client';

import { roboto } from '@/ui/fonts';
import { useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import AddressSearch from '@/components/AddressSearch';
import AddressDisplay from '@/components/AddressDisplay';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReportContext } from '@/contexts/ReportContext'; // Import the context

// Dynamically import MapDrawing for client-side rendering
const MapDrawing = dynamic(() => import('@/components/MapDrawing'), { ssr: false });

export default function RedeemReport() {
  // Use context values and setters
  const { 
    reportId, setReportId, 
    address, setAddress, 
    latitude, setLatitude, 
    longitude, setLongitude, 
    landGeometry, setLandGeometry, 
    addressComponents, setAddressComponents 
  } = useReportContext();

  const [step, setStep] = useState(1);
  const stepNames = ['Enter ID', 'Select Address', 'Define Boundary', 'Review & Submit'];

  const handleReportIdChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); // Only allow uppercase letters
      
    // Format the value with dashes after every 4 characters
    if (value.length > 3 && !(e.nativeEvent.inputType === 'deleteContentBackward' && value.length === 4)) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 8 && !(e.nativeEvent.inputType === 'deleteContentBackward' && value.length === 9)) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }
      
    setReportId(value); // Update the context
  };

  const handleAddressSelect = (address: string, lat: number, lng: number, components: Record<string, string>) => {
    setAddress(address); // Set the selected address
    setLatitude(lat); // Set the latitude
    setLongitude(lng); // Set the longitude
    setAddressComponents(components); // Set address components
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1);
    }
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(prevStep => prevStep + 1);
    }
  };

  const handleGenerateReport = () => {
    console.log('Generating report with the following details:');
    console.log('Report ID:', reportId);
    console.log('Address:', address);
    console.log('Boundary:', landGeometry);
    // Add actual logic to generate the report here
  };

  return (
    <div className={`${roboto.className} text-black min-h-screen flex-row justify-between`}>
      <div className="px-10 sm:px-20 md:px-40 py-10 sm:py-20 mx-auto">
        <div className="text-4xl font-bold mb-8 text-center">Redeem a Report</div>
        <div className="mb-8 px-10 mx-auto max-w-2xl">
          <ProgressBar currentStep={step} totalSteps={stepNames.length} stepNames={stepNames} />
        </div>

        {/* Step 1: Enter Report ID */}
        {step === 1 && (
          <div className="sm:px-10 mx-auto max-w-2xl">
            <div className="text-2xl font-semibold mb-4">Enter Report ID</div>
            <input
              id="reportId"
              type="text"
              value={reportId || ''}
              onChange={handleReportIdChange}
              maxLength={14}
              className="mt-1 block w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="XXXX-XXXX-XXXX"
            />

            <div className="flex justify-between w-full">
              <div className="">            
                <button
                  onClick={handleBackStep}
                  disabled={step < 2}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={reportId?.length !== 14}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address Search */}
        {step === 2 && (
          <div className="sm:px-10 mx-auto max-w-2xl">
            <div className="text-2xl font-semibold mb-4">Search for an Address</div>
            <AddressSearch
              onAddressSelect={handleAddressSelect}
              prompt="Search for a property address"
            />

            <div className={`mx-auto max-w-96 ${latitude && 'my-8'}`}>
              <AddressDisplay
                addressComponents={addressComponents}
                latitude={latitude}
                longitude={longitude}
              />
            </div>
              
            <div className="flex justify-between w-full">
              <div className="">            
                <button
                  onClick={handleBackStep}
                  disabled={step < 2}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={!address}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Define Property Boundary */}
        {step === 3 && latitude !== null && longitude !== null && (
          <div className="mx-auto max-w-4xl">
            <div className="text-2xl font-semibold mb-4">Define The Property Boundary</div>
            <ul className="mb-8 mx-8 space-y-2 text-dark-blue list-disc">
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
              />
            </div>

            <div className="flex justify-between w-full">
              <div className="">            
                <button
                  onClick={handleBackStep}
                  disabled={step < 2}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={landGeometry.length < 3}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Generate Report */}
        {step === 4 && (
          <div className="sm:px-10 mx-auto max-w-2xl">
            <div className="text-2xl font-semibold mb-4">Review & Submit</div>
            <div className="mb-2">
              <strong>Report ID:</strong> {reportId}
            </div>
            <div className="mb-2">
              <strong>Address:</strong> {address}
            </div>
            
            <div className="mb-4">
              <strong>Boundary Points:</strong> 
              <ul className="list-inside list-disc">
                {landGeometry.map((point, index) => (
                  <li className="" key={index}>
                    <span className="mr-4">Lat: {point[0].toFixed(8)}</span>
                    <span>Lng: {point[1].toFixed(8)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between w-full">
              <div className="">            
                <button
                  onClick={handleBackStep}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleGenerateReport}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75"
                >
                  Generate Report <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
