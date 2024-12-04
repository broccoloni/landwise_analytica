'use client';

import { roboto } from '@/ui/fonts';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import AddressSearch from '@/components/AddressSearch';
import AddressDisplay from '@/components/AddressDisplay';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';

// Dynamically import MapDrawing for client-side rendering
const MapDrawing = dynamic(() => import('@/components/MapDrawing'), { ssr: false });

export default function RedeemReport() {
  const [reportId, setReportId] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [landGeometry, setLandGeometry] = useState<number[][]>([]);
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
      
    setReportId(value);
  };

    
  const handleAddressSelect = (address: string, lat: number, lng: number, components: Record<string, string>) => {
    setSelectedAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    setAddressComponents(components);
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
    console.log('Address:', selectedAddress);
    console.log('Boundary:', landGeometry);
    // Add actual logic to generate the report here
  };

  return (
    <div className={`${roboto.className} text-black min-h-screen py-10 flex-row justify-between`}>
      <div className="mx-auto px-80 py-10">
        <div className="text-4xl font-bold mb-8 text-center">Redeem a Report</div>
        <div className="mb-8">
          <ProgressBar currentStep={step} totalSteps={stepNames.length} stepNames={stepNames} />
        </div>

        {/* Step 1: Enter Report ID */}
        {step === 1 && (
          <div className="">
            <div className="text-2xl font-semibold mb-4">Enter Report ID</div>
            <input
              id="reportId"
              type="text"
              value={reportId}
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
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={reportId.length !== 14}
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address Search */}
        {step === 2 && (
          <div className="">
            <div className="text-2xl font-semibold mb-4">Search for an Address</div>
            <AddressSearch
              onAddressSelect={handleAddressSelect}
              prompt="Search for a property address"
            />

            <div className={`mx-auto w-96 ${latitude && 'my-8'}`}>
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
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={!selectedAddress}
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Define Property Boundary */}
        {step === 3 && latitude !== null && longitude !== null && (
          <div className="">
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
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={!landGeometry}
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Generate Report */}
        {step === 4 && (
          <div>
            <div className="text-2xl font-semibold mb-4">Review & Submit</div>
            <div className="mb-2">
              <strong>Report ID:</strong> {reportId}
            </div>
            <div className="mb-2">
              <strong>Address:</strong> {selectedAddress}
            </div>
            
            <div className="mb-4">
              <strong>Boundary Points:</strong> 
              <div className="flex justify-center mt-2">
                {landGeometry.length > 0 ? (
                  <ul className="list-none space-y-1">
                    {landGeometry.map((point, index) => (
                      <li key={index} className="text-dark-blue">
                        Point {index + 1}: ({point[0]}, {point[1]})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">No boundary defined</div>
                )}
              </div>
            </div>

            <div className="flex justify-between w-full">
              <div className="">            
                <button
                  onClick={handleBackStep}
                  disabled={step < 2}
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleGenerateReport}
                  disabled={!reportId || !selectedAddress || !landGeometry}
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between text-md mx-auto mt-20 px-80">
        <div className="flex">
          <div className="mr-4 my-auto">Haven't Bought a Report Yet?</div>
          <div className="ml-auto">
            <Link
              href="/get-a-report"
              className="my-auto text-black hover:text-medium-brown hover:underline"
            >
              Get One Now
            </Link>
          </div>
        </div>
        <div className="flex">
          <div className="mr-4 my-auto">Already Redeemed Your Report?</div>
          <div className="ml-auto">
            <Link
              href="/view-an-existing-report"
              className="my-auto text-black hover:text-medium-brown hover:underline"
            >
              View Your Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
