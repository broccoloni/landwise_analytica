'use client';

import Container from '@/components/Container';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import dynamic from 'next/dynamic';
import AddressSearch from '@/components/AddressSearch';
import { MapContainer, TileLayer } from 'react-leaflet';
import Dropdown from '@/components/Dropdown';
import { Loader2 } from 'lucide-react';
import ee from '@google/earthengine';

// const basePath = '/landwise_analytica';
const basePath = '';

const MapDrawing = dynamic(() => import('@/components/MapDrawing'), { ssr: false });

type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Float32Array | Float64Array;

const DEMO_ADDRESS = {
  address: "8159 Side Road 30, Wellington County, Ontario, N0B 2K0, Canada",
  lat: "43.6929954",
  lng: "-80.3071343",
  components: {
    "street_number": "8159",
    "route": "Side Road 30",
    "locality": "Rockwood",
    "administrative_area_level_3": "Centre Wellington",
    "administrative_area_level_2": "Wellington County",
    "administrative_area_level_1": "ON",
    "country": "CA",
    "postal_code": "N0B 2K0"
  },
};

export default function Search() {
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
  const [landGeometry, setLandGeometry] = useState<number[][]>([]);
  const [eeData, setEeData] = useState(null);
  const [years, setYears] = useState<number[]>([]);
  const [curYear, setCurYear] = useState<number|null>(null);
  const [crops, setCrops] = useState<string[]>([]);
  const [curCrop, setCurCrop] = useState<string|null>(null);
  const [curData, setCurData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
    
  const handleAddressSelect = (address: string, lat: number, lng: number, components: Record<string, string>) => {
    console.log(components);
      
    setSelectedAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    setAddressComponents(components);
  };

  const handleUseDemoAddress = () => {
    setSelectedAddress(DEMO_ADDRESS.address);
    setLatitude(DEMO_ADDRESS.lat);
    setLongitude(DEMO_ADDRESS.lng);
    setAddressComponents(DEMO_ADDRESS.components);
  };

  const fetchEarthEngineData = async (points: number[][]) => {
    try {
      const response = await fetch('/api/getEarthEngineData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points }),
      });
        
      if (!response.ok) {
        throw new Error('Failed to fetch data from the API');
      }

      const data = await response.json();

      if (data && data.results) {    
        setEeData(data.results);
          
        const data_years = Object.keys(data.results);
        setYears(data_years);
 
        console.log("Years available:", data_years);
        
        // Extract crops (keys of the first year's crops)
        if (data_years.length > 0) {
          const firstYear = data_years[0];
          const data_crops = Object.keys(data.results[firstYear]);

          console.log("Crops available:", data_crops);

          console.log("first year:", firstYear);
          console.log("first crop:", data_crops[0]);
          console.log("r1:", data.results[firstYear]);
          console.log("r2:", data.results[firstYear][data_crops[0]]);

          setCrops(data_crops);
          setCurYear(firstYear);

          if (data_crops.length > 0) {
            setCurCrop(data_crops[0]);
          }
        }
      }        
        
      console.log('Fetched Earth Engine data:', data);
      setLoadingData(false);
        
    } catch (error) {
      console.error('Error fetching Earth Engine data:', error);
    }
  };
    
  useEffect(() => {
    if (landGeometry.length > 0) {
      fetchEarthEngineData(landGeometry);
    }
  }, [landGeometry]);

  useEffect(() => {
    if (eeData && curYear && curCrop){
      console.log(curYear, curCrop);
      console.log("Cur Data Updated:", eeData[curYear][curCrop]);

      setCurData(eeData[curYear][curCrop]);
    }
  }, [eeData,curYear,curCrop]);
    
  const PrintGeometry = () => {
    if (landGeometry.length === 0) {
      return null;
    }
    return (
      <div className="">
        {landGeometry.map((point, index) => (
          <div key={index} className="pb-2">
            <span className="mr-4">Point {index + 1}:</span> 
            <span>Latitude: {point[0]}</span>, <span>Longitude: {point[1]}</span>
          </div>
        ))}
      </div>
    );
  };

  const CropSelector = () => {
    if (crops.length === 0 || !curCrop) {
      return null;
    }
    return (
      <Dropdown 
        options={crops} 
        selected={curCrop} 
        onSelect={setCurCrop} 
      />
    );
  };

  const YearSelector = () => {
    if (years.length === 0 || !curYear) {
      return null;
    }
    return (
      <Dropdown 
        options={years} 
        selected={curYear} 
        onSelect={setCurYear} 
        className="mr-2"
      />
    );
  };
    
  return (
    <div className={`${roboto.className} bg-accent-light text-black`}>
      <div className="relative m-4">
        <Container className="mb-4">
          <section id="search">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
              Search
            </div>
            <div className="mb-2">
              Search for an address 
            </div>
            <div className = "mb-4">
              <AddressSearch 
                onAddressSelect={handleAddressSelect} 
                prompt="Search for an address" 
              />
            </div>
            <div className="">
              <button
                className="bg-accent-medium rounded-lg px-4 py-2 text-white hover:opacity-75"
                onClick={handleUseDemoAddress}
              >
                Use Demo Address
              </button>
            </div>
          </section>
        </Container>
        {selectedAddress && (
          <>
            <Container className="mb-4">
              <section id="property">
                <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                  Property
                </div>
                <div className="sm:flex flex-row">
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
                      <p className="mr-4">State:</p>
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
                  <div className="sm:ml-4 sm:mt-0 mt-4 w-full">
                    <div className='w-full h-full flex justify-center items-center text-center'>
                      Image of address (not implemented yet)
                    </div>
                  </div>
                </div>
              </section>
            </Container>
            <Container className="mb-4">
              <section id="Map">
                <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                  Map
                </div>
                <div className="w-full h-full flex justify-center items-center">
                  <MapDrawing latitude={latitude} longitude={longitude} zoom={15} setLandGeometry={setLandGeometry} />
                </div>
              </section>
            </Container>
          </>
        )}
        {landGeometry.length > 0 && (
          <>
            <Container className="mb-4">
              <section id='data'>
                <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                  Data
                </div>
                {loadingData ? (
                  <div className="flex justify-center h-full w-full my-20">
                    <Loader2 className="h-20 w-20 animate-spin text-black" />
                  </div>
                ) : (
                  <div className="">
                    <div className="flex">
                      <YearSelector />
                      <CropSelector />
                    </div>  
                    <PrintGeometry />
                  </div>
                )}
              </section>
            </Container>
          </>
        )}
      </div>
    </div>
  );
}
