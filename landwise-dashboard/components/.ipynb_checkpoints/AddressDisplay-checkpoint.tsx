import React from 'react';

type AddressComponents = {
  street_number: string;
  route: string;
  locality: string;
  postal_code: string;
  administrative_area_level_1: string;
  administrative_area_level_2: string;
  country: string;
};

type AddressProps = {
  addressComponents: AddressComponents;
  latitude: number;
  longitude: number;
};

const AddressDisplay = ({ addressComponents, latitude, longitude }: AddressProps) => {
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
        <p>{longitude}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="mr-4">Latitude:</p>
        <p>{latitude}</p>
      </div>
    </div>
  );
};

export default AddressDisplay;
