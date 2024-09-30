'use client';

import { useSearchParams } from 'next/navigation';
import Nav from '@/components/Nav'; // Import the SidebarNav component
import Container from '@/components/Container';
import { montserrat, roboto, merriweather } from '@/ui/fonts';
import { useRouter } from 'next/navigation';
import AddressSearch from '@/components/AddressSearch';
import LandHistory from '@/components/LandHistory';

const DEMO_ADDRESS = {
  address: "8159 Side Road 30, Wellington County, Ontario, N0B 2K0, Canada",
  lat: "43.6929954",
  lng: "-80.3071343"
};

export default function Analysis() {
  const router = useRouter();
    
  const searchParams = useSearchParams();
  const address = searchParams.get('address');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // Callback to handle new selected address in property
  const handleNewAddressSelect = (newAddress: string, newLat: number, newLng: number) => {
    router.push(`/analysis?address=${encodeURIComponent(newAddress)}&lat=${newLat}&lng=${newLng}`);
  };

  // Check if the current address is the demo address
  const isDemoAddress = address === DEMO_ADDRESS.address;

  return (
    <div className={`${roboto.className} flex bg-accent-light`}>
      {/* Left Navigation Menu */}
      <Nav />

      {/* Main Content Area */}
      <div className="w-[90%] relative m-4">
        <Container className="mb-4">
          <section id="property">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                Property
            </div>

            {isDemoAddress && (
              <p className="mb-2 text-accent text-xl text-center">This is the demo address!</p>
            )}
              
            <p className="mb-2">Address: {address}</p>
            <p className="mb-2">Latitude: {lat}</p>
            <p className="mb-2">Longitude: {lng}</p>

            <div className="mt-8">
              <AddressSearch onAddressSelect={handleNewAddressSelect} prompt="Search for a new address" /> 
            </div>
          </section>
        </Container>

        <Container className="mb-4">
          <section id="land-history">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                Land History
            </div>

            <LandHistory latitude = {lat} longitude = {lng} />
          </section>
        </Container>

        <Container className="mb-4">
          <section id="trends">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                Trends
            </div>
          </section>
        </Container>

        <Container>
          <section id="agriculture-tips">
            <div className={`${merriweather.className} text-accent-dark text-2xl pb-2`}>
                Agriculture Tips
            </div>
          </section>
        </Container>
      </div>
    </div>
  );
}
