'use client';

import React, { useRef, useEffect } from 'react';
import { useLoadScript } from "@react-google-maps/api";

type AddressSearchProps = {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
  prompt: string;
};

const libraries = ["places"];

export default function AddressSearch({ onAddressSelect, prompt }: AddressSearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    loading: { async: true },
  });

  useEffect(() => {
    if (!isLoaded || loadError || !inputRef.current) return; // Ensure inputRef is available

    const options = {
      componentRestrictions: { country: "ca" }, // restrict to Canada
      fields: ["formatted_address", "geometry"],
    };

    // Initialize Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);
    
    // Add the event listener
    const placeChangedListener = autocomplete.addListener("place_changed", () => {
      handlePlaceChanged(autocomplete); // Pass the autocomplete instance to the handler
    });

    // Cleanup function to remove the listener and unbind all events
    return () => {
      google.maps.event.removeListener(placeChangedListener);
      autocomplete.unbindAll();
    };
  }, [isLoaded, loadError]);

  const handlePlaceChanged = (autocomplete: google.maps.places.Autocomplete) => {
    const place = autocomplete.getPlace(); // Use the passed autocomplete instance

    if (place?.formatted_address && place?.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onAddressSelect(place.formatted_address, lat, lng);
    } else {
      console.error("No place details available");
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        ref={inputRef}
        placeholder={prompt}
        className="w-full text-black px-6 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
    </div>
  );
}
