'use client';

import { roboto } from '@/ui/fonts';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import AddressSearch from '@/components/AddressSearch';

// Dynamically import MapDrawing for client-side rendering
const MapDrawing = dynamic(() => import('@/components/MapDrawing'), { ssr: false });

export default function Terms() {
  const [reportId, setReportId] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [landGeometry, setLandGeometry] = useState<number[][]>([]);
  const [step, setStep] = useState(1); // Track the current step in the process

  const handleReportIdChange = (e) => {
    let input = e.target.value;

    input = input.replace(/[^A-Z0-9-]/g, '');

    // Format the input with dashes after every 4 characters
    if (input.length <= 4) {
      input = input.substring(0, 4);
    } else if (input.length <= 8) {
      input = input.substring(0, 8);
      input = input.replace(/(.{4})(?=.)/g, '$1-');
    } else {
      input = input.substring(0, 12);
      input = input.replace(/(.{4})(?=.)/g, '$1-');
    }

    setReportId(input);
  };

    
  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setSelectedAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    setStep(3); // Move to the next step after selecting an address
  };

  const handleNextStep = () => {
    if (step === 1 && reportId.trim()) {
      setStep(2);
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
    <div className={`${roboto.className} text-black min-h-screen`}>
      <div className="mx-auto px-40 py-20">
        <h1 className="text-4xl font-bold mb-6">Redeem a Report</h1>

        {/* Step 1: Enter Report ID */}
        {step >= 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Enter Report ID</h2>
          <input
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            value={reportId}
            onChange={handleReportIdChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-medium"
            maxLength={14} // Limit input length to the format length (XXXX-XXXX-XXXX)
          />
          <button
            onClick={handleNextStep}
            disabled={reportId.length !== 14} // Enable only when the length is exactly 14 (XXXX-XXXX-XXXX)
            className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        )}

        {/* Step 2: Address Search */}
        {step >= 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Search for an Address</h2>
            <AddressSearch
              onAddressSelect={(address, lat, lng) => handleAddressSelect(address, lat, lng)}
              prompt="Search for a property address"
            />
          </div>
        )}

        {/* Step 3: Define Property Boundary */}
        {step >= 3 && latitude !== null && longitude !== null && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Define Property Boundary</h2>
            <div className="w-full h-96 border">
              <MapDrawing
                latitude={latitude}
                longitude={longitude}
                zoom={15}
                setLandGeometry={setLandGeometry}
              />
            </div>
            <button
              onClick={() => setStep(4)}
              className="mt-4 bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 4: Generate Report */}
        {step >= 4 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Generate Report</h2>
            <p className="mb-2">
              <strong>Report ID:</strong> {reportId}
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {selectedAddress}
            </p>
            <p className="mb-4">
              <strong>Boundary Points:</strong> {landGeometry.length > 0 ? landGeometry.map((point) => `(${point[0]}, ${point[1]})`).join(', ') : 'No boundary defined'}
            </p>
            <button
              onClick={handleGenerateReport}
              className="bg-medium-brown text-white px-6 py-2 rounded-lg hover:opacity-75"
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
