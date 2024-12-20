'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ReportContextProps {
  landGeometry: number[][];
  setLandGeometry: (points: number[][]) => void;
  address: string | null;
  setAddress: (address: string | null) => void;
  latitude: number | null;
  setLatitude: (latitude: number | null) => void;
  longitude: number | null;
  setLongitude: (longitude: number | null) => void;
  addressComponents: Record<string, string> | null;
  setAddressComponents: (components: Record<string, string> | null) => void;
  reportId: string | null;
  setReportId: (id: string | null) => void;
}

const ReportContext = createContext<ReportContextProps | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [landGeometry, setLandGeometry] = useState<number[][]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  // Load initial values from localStorage once the component is mounted
  useEffect(() => {
    const storedLandGeometry = localStorage.getItem('landGeometry');
    if (storedLandGeometry) setLandGeometry(JSON.parse(storedLandGeometry));

    setAddress(localStorage.getItem('address') || null);

    const storedLatitude = localStorage.getItem('latitude');
    if (storedLatitude) setLatitude(parseFloat(storedLatitude));

    const storedLongitude = localStorage.getItem('longitude');
    if (storedLongitude) setLongitude(parseFloat(storedLongitude));

    const storedAddressComponents = localStorage.getItem('addressComponents');
    if (storedAddressComponents) setAddressComponents(JSON.parse(storedAddressComponents));

    setReportId(localStorage.getItem('reportId') || null);
  }, []);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('landGeometry', JSON.stringify(landGeometry));
  }, [landGeometry]);

  useEffect(() => {
    if (address !== null) localStorage.setItem('address', address);
    else localStorage.removeItem('address');
  }, [address]);

  useEffect(() => {
    if (latitude !== null) localStorage.setItem('latitude', latitude.toString());
    else localStorage.removeItem('latitude');
  }, [latitude]);

  useEffect(() => {
    if (longitude !== null) localStorage.setItem('longitude', longitude.toString());
    else localStorage.removeItem('longitude');
  }, [longitude]);

  useEffect(() => {
    if (addressComponents !== null) localStorage.setItem('addressComponents', JSON.stringify(addressComponents));
    else localStorage.removeItem('addressComponents');
  }, [addressComponents]);

  useEffect(() => {
    if (reportId !== null) localStorage.setItem('reportId', reportId);
    else localStorage.removeItem('reportId');
  }, [reportId]);

  return (
    <ReportContext.Provider
      value={{
        landGeometry,
        setLandGeometry,
        address,
        setAddress,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        addressComponents,
        setAddressComponents,
        reportId,
        setReportId,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
};
