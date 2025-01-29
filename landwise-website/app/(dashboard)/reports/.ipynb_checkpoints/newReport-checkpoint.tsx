'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import AddressSearch from '@/components/AddressSearch';
import AddressDisplay from '@/components/AddressDisplay';
import ProgressBar from '@/components/ProgressBar';
import { ArrowLeft, ArrowRight, Check, X, NotebookText } from 'lucide-react';
import { useReportContext } from '@/contexts/ReportContext';
import { useCartContext } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { ReportStatus, RealtorStatus } from '@/types/statuses';
import CheckoutSession from '@/components/CheckoutSession';
import Loading from '@/components/Loading';
import { fetchReportsBySessionId, redeemReport, sqMetersPerAcre } from '@/utils/reports';
import NotificationBanner from '@/components/NotificationBanner';
import { toTitleCase } from '@/utils/string';
import Link from 'next/link';
import { getCouponName } from '@/utils/pricingTiers';
import { useReportsByCustomerId } from "@/hooks/useReports";

const MapDrawing = dynamic(() => import('@/components/MapDrawing'), { ssr: false });

export default function NewReport() {
  const router = useRouter();
  const { data: session } = useSession();
  const { 
    reportId, setReportId, 
    address, setAddress, 
    latitude, setLatitude, 
    longitude, setLongitude, 
    landGeometry, setLandGeometry, 
    addressComponents, setAddressComponents,
    status, setStatus,
    reportSize, setReportSize,
  } = useReportContext();

  const { setQuantity, setCustomerId, setCouponId, setSessionId, sessionId, size, setSize, setPriceId } = useCartContext();

  // Calculate discount based off of reports ordered this month
  const [prices, setPrices] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any>(null);

  useEffect(() => {
    const getReportPricesAndCoupons = async () => {
      try {
        const response = await fetch('/api/getReportPricesAndCoupons', {
          method: 'GET',
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch prices');
        }
    
        const { prices, coupons } = await response.json();

        console.log("Fetched Prices:", prices);
        console.log("Fetched Coupons:", coupons);
          
        setPrices(prices.data);
        setCoupons(coupons.data);
          
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error('An unexpected error occurred');
        }
      }
    };

    getReportPricesAndCoupons();
  }, []);  

  const { reports, isLoading, error } = useReportsByCustomerId(session?.user?.id || null);
  useEffect(() => {
    if (reports && !isLoading && prices && coupons) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Filter reports created this month
      const reportsThisMonth = reports.filter((report) => {
        const createdAt = new Date(report.createdAt);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      });

      const couponName = getCouponName(reportsThisMonth.length);
      if (couponName) {
        const coupon = coupons.find((coupon: any) => coupon.name === couponName);

        if (coupon) {
          setCouponId(coupon.id);
        }
      }
    }
  }, [reports, isLoading, coupons]);
    
  const [step, setStep] = useState(1);
  const stepNames = ['Select Address', 'Define Boundary', 'Review', 'Payment'];

  const handleAddressSelect = (address: string, lat: number, lng: number, components: Record<string, string>) => {
    setAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    setAddressComponents(components);
  };

  const topRef = useRef<HTMLDivElement>(null);

  const handleBackStep = () => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1);
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
    
  const handleNextStep = () => {
    if (step === 1) {
      setLandGeometry([]);
      setStep(prevStep => prevStep + 1);
    }
    else if (step === 2) {
      setQuantity(null);
      setCustomerId(null);
      setSessionId(null);
      setStep(prevStep => prevStep + 1);
    }

    else if (step === 3) {
      setQuantity(1);
      setCustomerId(session?.user?.id || null);

      if (!prices) {
        return;
      }

      const curPrice = prices.find((price: any) => price.lookup_key === size);
      if (!curPrice) {
        return;
      }

      setPriceId(curPrice.id);
        
      setStep(prevStep => prevStep + 1);
    }
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
    
  const handleComplete = (completedSessionId: string) => {
    setQuantity(null);
    setCouponId(null);
    setCustomerId(null);
    setCouponId(null);
    setSessionId(completedSessionId);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const fetchReportId = async () => {
    if (!sessionId) {
      console.error("Session ID is null or undefined.");
      return;
    }
      
    try {
      const reports = await fetchReportsBySessionId(sessionId);
        
      if (reports.length > 0) {
        setReportId(reports[0].reportId);
        setStatus(reports[0].status);
      }
    } catch (err) {
      console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } 
  };
    
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!reportId && sessionId) {
        fetchReportId();
      } else {
        clearInterval(intervalId); 
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [reportId, sessionId]);

  const handleRedeem = async () => {
    if (!reportId || !address || !addressComponents || landGeometry.length <= 3) {
      console.error('Required fields are missing or invalid.');
      return;
    }
      
    const result = await redeemReport({ reportId, address, addressComponents, landGeometry });
    if (result.success) {
      console.log('Report redeemed successfully');
      router.push(`/view-report/${reportId}`);
    } else {
      console.error('Failed to redeem report:', result.message);
    }
  };
    
  useEffect(() => {
    if (step === 4 && reportId && address && addressComponents && landGeometry.length > 3 && status === ReportStatus.Unredeemed) {
      handleRedeem();
    }
  }, [reportId, address, addressComponents, landGeometry, status, step]);

  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState<'error' | 'loading' | 'info' | 'success' | undefined>('info');
  useEffect(() => {
    if (session?.user?.status === RealtorStatus.Unverified) {
      setNotification("Please verify your email to purchase reports using this account");
    }
  }, [session?.user?.status]);

  const handleNewVerificationEmail = async () => {
    if (!session?.user?.email || !session?.user?.id) {
      console.error("User email or ID is missing.");
      return;
    }

    try {
      const response = await fetch('/api/sendVerificationEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error sending verification email:", data.message);
        setNotification(`Failed to send verification email: ${data.message}`);
        setNotificationType('error');
      } else {
        console.log("Verification email sent successfully:", data.message);
        setNotification("Verification email sent successfully!");
        setNotificationType('success');
      }
    } catch (error) {
      console.error("An error occurred while sending the verification email:", error);
      setNotification("An error occurred. Please try again later.");
      setNotificationType('error');
    }
  };
    
  return (
    <div ref={topRef}>
      {notification && (
        <div className="mb-4">
          <NotificationBanner type={notificationType}>
            <div className="flex justify-between items-center mr-4">
              <div className="">Please verify your email address before purchasing a report</div>
              <button 
                className="hover:underline px-4 py-2 rounded-md border border-blue-800"
                onClick={handleNewVerificationEmail}
              >
                Send New Link
              </button>
            </div>
          </NotificationBanner>
        </div>
      )}
      <div className="text-2xl mb-12 text-center">Order a New Report</div>
      <div className="mb-8 px-10 mx-auto max-w-2xl">
        <ProgressBar currentStep={step} totalSteps={stepNames.length} stepNames={stepNames} />
      </div>
  
        {/* Step 1: Address Search */}
        {step === 1 && (
          <div className="">
            <div className="text-xl text-dark-blue mb-4">Search for an Address</div>
            <AddressSearch
              onAddressSelect={handleAddressSelect}
              prompt="Search for a property address"
            />

            <div className={`mx-auto w-96 ${latitude && 'my-8'}`}>
              <AddressDisplay
                addressComponents={addressComponents}
                latitude={latitude}
                longitude={longitude}
              />
            </div>
              
            <div className="flex justify-between w-full">
              <div className="">            
                <button
                  onClick={handleBackStep}
                  disabled={step < 2}
                  className="flex items-center justify-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={!address}
                  className="flex items-center justify-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Define Property Boundary */}
        {step === 2 && latitude !== null && longitude !== null && (
          <div className="">
            <div className="text-xl mb-4">Define The Property Boundary</div>
            <ul className="mb-8 mx-8 space-y-2 text-dark-blue list-disc">
              <li className="">Click to add a boundary point</li>
              <li className="">Double-click to close the boundary</li>
              <li className="">Use the cursor to move points, if necessary</li>
            </ul>

            <div className="w-full">
              <MapDrawing
                latitude={latitude}
                longitude={longitude}
                zoom={15}
                points={landGeometry}
                setPoints={setLandGeometry}
                size={size}
                setSize={setSize}
              />
            </div>

            <div className="flex justify-between w-full">
              <div className="">            
                <button
                  onClick={handleBackStep}
                  disabled={step < 2}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={!landGeometry || landGeometry.length < 3}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generate Report */}
        {step === 3 && (
          <div>
            <div className="text-xl font-semibold mb-4">Review & Submit</div>
            <div className="mb-2">
              <strong>Address:</strong>
              <span className="ml-4">{address}</span>
            </div>
            
            <div className="mb-4">
              <strong>Boundary Points:</strong> 
              <div className="flex justify-center mt-2">
                {landGeometry.length > 0 ? (
                  <ul className="list-none space-y-1">
                    {landGeometry.map((point, index) => (
                      <li key={index} className="text-dark-blue">
                        Point {index + 1}: ({point[0]}, {point[1]})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">No boundary defined</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <strong>Property Size:</strong>
              <span className="ml-4">{toTitleCase(size)}</span>
            </div>

            <div className="flex justify-between w-full">
              <div className="">            
                <button
                  onClick={handleBackStep}
                  disabled={step < 2}
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </button>
              </div>
              <div className="">            
                <button
                  onClick={handleNextStep}
                  disabled={ !address || landGeometry.length < 3 }
                  className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-6 pr-4 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generate Report */}
        {step === 4 && (
          <div className="">
            {sessionId ? ( 
              <div className="p-20">
                <Loading />
              </div>
            ) : session?.user?.status && session?.user?.status === RealtorStatus.Active && size && size !== 'jumbo' ? (
              <div className="flex justify-center">
                <div className="mr-4 w-32">
                  <button
                    onClick={handleBackStep}
                    disabled={step < 2}
                    className="flex justify-center items-center mt-4 bg-medium-brown text-white pl-4 pr-6 py-2 rounded-lg hover:opacity-75 disabled:opacity-50"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" /> Back
                  </button>
                </div>
                <CheckoutSession onComplete={handleComplete} />
                <div className="w-32" />
              </div>
            ) : session?.user?.status && session?.user?.status === RealtorStatus.Active && size && size === 'jumbo' ? (
              <div>
                <div className="font-semibold text-2xl text-center text-dark-blue mb-8">{toTitleCase(size)} Report</div>
                <div className="mb-8">To purchase a <span className="font-bold">{toTitleCase(size)}</span> report, please contact us to request a quote using the button below</div>
    
                <div className="flex justify-center items-center mb-8">
                  <Link
                     href={`/contact`}
                     className="px-4 py-2 bg-medium-brown hover:opacity-75 text-white rounded"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                    Request a Quote
                  </Link>
                </div>
    
                  
                <div className="mb-4">
                  <div className="mb-2">We do this to</div>
                  <ul className="list-disc ml-5">
                    <li>Ensure the authenticity of {size} report requests</li>
                    <li>Verify the intended property boundary</li>
                    <li>Prevent processing from interfering with our other operations</li>
                  </ul>
                </div>
                <div className="">Thank you for your understanding.</div>
              </div>
            ) : (
              <NotificationBanner type='error'>Something went wrong. Please try again later.</NotificationBanner>
            )}
          </div>
        )}
    </div>
  );
}