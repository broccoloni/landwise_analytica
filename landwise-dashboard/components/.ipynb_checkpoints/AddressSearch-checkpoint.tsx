'use client';

import React, { useRef, useEffect } from 'react';
import { useLoadScript } from "@react-google-maps/api";

type AddressSearchProps = {
  onAddressSelect: (address: string, lat: number, lng: number, addressComponents: Record<string, string>) => void;
  prompt: string;
};

const libraries: any = ["places"];

export default function AddressSearch({ onAddressSelect, prompt }: AddressSearchProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.error("Google Maps API key is not set");
    return null; //Implement some display to show google api key isn't working
  }

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || loadError || !inputRef.current) return; // Ensure inputRef is available

    const options = {
      componentRestrictions: { country: "ca" }, // restrict to Canada
      fields: ["formatted_address", "geometry", "address_components"], // include address components
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

  // Helper function to extract address components
  const extractAddressComponents = (addressComponents: google.maps.GeocoderAddressComponent[]) => {
    const componentForm: Record<string, string> = {};

    addressComponents.forEach((component) => {
      const types = component.types;
      if (types.includes('street_number')) componentForm['street_number'] = component.long_name;
      if (types.includes('route')) componentForm['route'] = component.long_name;
      if (types.includes('locality')) componentForm['locality'] = component.long_name;
      if (types.includes('administrative_area_level_1')) componentForm['administrative_area_level_1'] = component.short_name;
      if (types.includes('administrative_area_level_2')) componentForm['administrative_area_level_2'] = component.short_name;
      if (types.includes('administrative_area_level_3')) componentForm['administrative_area_level_3'] = component.short_name;
      if (types.includes('country')) componentForm['country'] = component.short_name;
      if (types.includes('postal_code')) componentForm['postal_code'] = component.long_name;
    });

    return componentForm;
  };

  const handlePlaceChanged = (autocomplete: google.maps.places.Autocomplete) => {
    const place = autocomplete.getPlace(); // Use the passed autocomplete instance

    if (place?.formatted_address && place?.geometry?.location && place?.address_components) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const addressComponents = extractAddressComponents(place.address_components);
      onAddressSelect(place.formatted_address, lat, lng, addressComponents);
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
        className="w-full text-black px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
    </div>
  );
}
