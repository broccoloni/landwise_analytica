'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import AddressSearch from '@/components/AddressSearch';
import AddressDisplay from '@/components/AddressDisplay';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const MapDrawing = dynamic(() => import('@/components/MapDrawing'), { ssr: false });

export default function NewReport() {
  const { data: session } = useSession();

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [landGeometry, setLandGeometry] = useState<number[][]>([]);
  const [step, setStep] = useState(1);

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
    if (step < 3) {
      setStep(prevStep => prevStep + 1);
    }
  };
    
  const handleGenerateReport = () => {
    console.log('Generating report with the following details:');
    console.log('Address:', selectedAddress);
    console.log('Boundary:', landGeometry);
    // Add actual logic to generate the report here
  };
    
  return (
    <div>
      <div className="text-2xl mb-4">Order a New Report</div>

        {/* Step 1: Address Search */}
        {step === 1 && (
          <div className="">
            <div className="text-xl text-dark-blue mb-4">Search for an Address</div>
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
                  className="flex items-center justify-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={!selectedAddress}
                  className="flex items-center justify-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Define Property Boundary */}
        {step === 2 && latitude !== null && longitude !== null && (
          <div className="">
            <div className="text-xl text-dark-blue mb-4">Define The Property Boundary</div>
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
                  disabled={!landGeometry || landGeometry.length < 3}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generate Report */}
        {step === 3 && (
          <div>
            <div className="text-xl text-dark-blue mb-4">Review & Submit</div>
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
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleGenerateReport}
                  disabled={ !selectedAddress || !landGeometry }
                  className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}