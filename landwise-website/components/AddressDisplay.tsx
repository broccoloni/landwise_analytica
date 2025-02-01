import React from 'react';

type AddressProps = {
  addressComponents: Record<string, string>|null;
  latitude: number|string|null;
  longitude: number|string|null;
};

const AddressDisplay = ({ addressComponents, latitude, longitude }: AddressProps) => {
  if (!addressComponents) {
    return null;
  }
    
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <p className="mr-4">Address:</p>
        <p>{addressComponents.street_number} {addressComponents.route}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="mr-4">Locality:</p>
        <p>{addressComponents.locality}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="mr-4">Postal Code:</p>
        <p>{addressComponents.postal_code}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="mr-4">State / Province:</p>
        <p>{addressComponents.administrative_area_level_1}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="mr-4">County:</p>
        <p>{addressComponents.administrative_area_level_2}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="mr-4">Country:</p>
        <p>{addressComponents.country}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="mr-4">Longitude:</p>
        <p>{longitude.toFixed(6)}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="mr-4">Latitude:</p>
        <p>{latitude.toFixed(6)}</p>
      </div>
    </div>
  );
};

export default AddressDisplay;
