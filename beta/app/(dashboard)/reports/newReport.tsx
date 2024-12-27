'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import AddressSearch from '@/components/AddressSearch';
import AddressDisplay from '@/components/AddressDisplay';
import ProgressBar from '@/components/ProgressBar';
import { ArrowLeft, ArrowRight, Check, X, NotebookText } from 'lucide-react';
import { useReportContext } from '@/contexts/ReportContext';
import { useRouter } from 'next/navigation';
import { ReportStatus } from '@/types/statuses';
const MapDrawing = dynamic(() => import('@/components/MapDrawing'), { ssr: false });

export default function NewReport() {
  const router = useRouter();
  const { data: session } = useSession();
  const { 
    reportId, setReportId, 
    address, setAddress, 
    latitude, setLatitude, 
    longitude, setLongitude, 
    landGeometry, setLandGeometry, 
    addressComponents, setAddressComponents,
    status, setStatus,
  } = useReportContext();

  const [step, setStep] = useState(1);
  const stepNames = ['Select Address', 'Define Boundary', 'Review & Submit'];

  const handleAddressSelect = (address: string, lat: number, lng: number, components: Record<string, string>) => {
    setAddress(address);
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
    if (step === 1) {
      setLandGeometry([]);
      setStep(prevStep => prevStep + 1);
    }
    else if (step === 2) {
      setStep(prevStep => prevStep + 1);
    }
  };

  const createReport = async (sessionOrCustomerId: string) => {
    try {
      const response = await fetch('/api/createReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionOrCustomerId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }
        
      setReportId(result.reportId);
      setStatus(ReportStatus.Unredeemed);
      return result.reportId;

    } catch (error) {
      console.error('Error creating report:', error);
      return null;
    }
  };

    
  const handleGenerateReport = async () => {
    console.log("Generating report with id:", session.user.id);
    const reportId = await createReport(session.user.id);
    if (reportId) {
      router.push('/view-realtor-report');
    }
  };
    
  return (
    <div>
      <div className="text-2xl mb-12 text-center">Order a New Report</div>
      <div className="mb-8 px-10 mx-auto max-w-2xl">
        <ProgressBar currentStep={step} totalSteps={stepNames.length} stepNames={stepNames} />
      </div>
  
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
                  disabled={!address}
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
            <div className="text-xl mb-4">Define The Property Boundary</div>
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
            <div className="text-xl font-semibold mb-4">Review & Submit</div>
            <div className="mb-2">
              <strong>Address:</strong> {address}
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
                  disabled={ !address || landGeometry.length < 3 }
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