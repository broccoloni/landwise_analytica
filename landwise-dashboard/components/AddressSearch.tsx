'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function AddressSearch() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    if (window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setSelectedAddress(place.formatted_address);
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      {/* Search Input Wrapper */}
      <div className="relative w-full max-w-lg">
        {/* Search Input */}
        <input
          type="text"
          ref={inputRef}
          placeholder="Search for an address"
          className="w-full text-black px-6 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        {/* Search Icon */}
        <button className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 pr-2">
          <Search size={24} />
        </button>
      </div>

      {/* Display selected address */}
      {selectedAddress && (
        <p className="mt-2 text-gray-700">Selected Address: {selectedAddress}</p>
      )}
    </div>
  );
}
