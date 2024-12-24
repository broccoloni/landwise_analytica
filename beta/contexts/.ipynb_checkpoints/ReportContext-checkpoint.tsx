'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

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
  status: string | null;
  setStatus: (status: string | null) => void;
}

const ReportContext = createContext<ReportContextProps | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [landGeometry, setLandGeometry] = useState<number[][]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
    
  // Load initial values from localStorage once the component is mounted
  useEffect(() => {
    try {
      const storedLandGeometry = localStorage.getItem('landGeometry');
      if (storedLandGeometry) setLandGeometry(JSON.parse(storedLandGeometry));

      const storedAddress = localStorage.getItem('reportAddress');
      if (storedAddress) setAddress(storedAddress);

      const storedLatitude = localStorage.getItem('latitude');
      if (storedLatitude) setLatitude(parseFloat(storedLatitude));

      const storedLongitude = localStorage.getItem('longitude');
      if (storedLongitude) setLongitude(parseFloat(storedLongitude));

      const storedAddressComponents = localStorage.getItem('addressComponents');
      if (storedAddressComponents) setAddressComponents(JSON.parse(storedAddressComponents));

      const storedReportId = localStorage.getItem('reportId');
      if (storedReportId) setReportId(storedReportId);

      const storedStatus = localStorage.getItem('reportStatus');
      if (storedStatus) setStatus(storedStatus);
        
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Sync state changes with localStorage
  useEffect(() => {
    landGeometry.length > 0
      ? localStorage.setItem('landGeometry', JSON.stringify(landGeometry))
      : localStorage.removeItem('landGeometry');
  }, [landGeometry]);

  useEffect(() => {
    address !== null
      ? localStorage.setItem('reportAddress', address)
      : localStorage.removeItem('reportAddress');
  }, [address]);

  useEffect(() => {
    latitude !== null
      ? localStorage.setItem('latitude', latitude.toString())
      : localStorage.removeItem('latitude');
  }, [latitude]);

  useEffect(() => {
    longitude !== null
      ? localStorage.setItem('longitude', longitude.toString())
      : localStorage.removeItem('longitude');
  }, [longitude]);

  useEffect(() => {
    addressComponents !== null
      ? localStorage.setItem('addressComponents', JSON.stringify(addressComponents))
      : localStorage.removeItem('addressComponents');
  }, [addressComponents]);

  useEffect(() => {
    reportId !== null
      ? localStorage.setItem('reportId', reportId)
      : localStorage.removeItem('reportId');
  }, [reportId]);

  useEffect(() => {
    status !== null
      ? localStorage.setItem('reportStatus', status)
      : localStorage.removeItem('reportStatus');
  }, [status]);

  const value = useMemo(
    () => ({
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
      status,
      setStatus,
    }),
    [landGeometry, address, latitude, longitude, addressComponents, reportId, status]
  );

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
};
