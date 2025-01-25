'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

type AddressSearchWithButtonProps = {
  onAddressSelect: (address: string, lat: number, lng: number, addressComponents: Record<string, string>) => void;
  prompt: string;
  onSubmit: () => void;
};

export default function AddressSearchWithButton({ onAddressSelect, prompt, onSubmit }: AddressSearchWithButtonProps) {
  const { googleApiKey, scriptLoaded } = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [addressSelected, setAddressSelected] = useState<boolean>(false);

  useEffect(() => {
    if (scriptLoaded && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
        componentRestrictions: { country: "ca" },
        fields: ["formatted_address", "geometry", "address_components"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address && place?.geometry?.location && place?.address_components) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const addressComponents = extractAddressComponents(place.address_components);
          onAddressSelect(place.formatted_address, lat, lng, addressComponents);
          setAddressSelected(true);
        } else {
          console.error("No place details available");
        }
      });

      return () => {
        google.maps.event.clearInstanceListeners(autocomplete);
      };
    }
  }, [scriptLoaded]);

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

  return (
    <div className="relative w-full flex">
      <input
        type="text"
        ref={inputRef}
        placeholder={prompt}
        className="w-full text-black px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <button 
        onClick={onSubmit}
        disabled={!addressSelected}
        className="bg-medium-brown text-white px-6 py-2 rounded-r-full hover:opacity-75"
      >
        <Search className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
