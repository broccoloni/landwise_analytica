'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

type AddressSearchProps = {
  onAddressSelect: (address: string, lat: number, lng: number, addressComponents: Record<string, string>) => void;
  prompt: string;
};

export default function AddressSearch({ onAddressSelect, prompt }: AddressSearchProps) {
  const { googleApiKey, scriptLoaded } = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!scriptLoaded || !googleApiKey || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
      componentRestrictions: { country: 'ca' },
      fields: ['formatted_address', 'geometry', 'address_components'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address && place?.geometry?.location && place?.address_components) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const addressComponents = extractAddressComponents(place.address_components);
        onAddressSelect(place.formatted_address, lat, lng, addressComponents);
      } else {
        console.error('No place details available');
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [scriptLoaded, googleApiKey]);

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
    <div className="relative w-full">
      <input
        type="text"
        ref={inputRef}
        placeholder={prompt}
        className="w-full text-black px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
    </div>
  );
}
