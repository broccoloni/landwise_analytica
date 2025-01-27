'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface ReportContextProps {
  landGeometry: number[][];
  setLandGeometry: React.Dispatch<React.SetStateAction<number[][]>>;
  reportSize: string | null;
  setReportSize: React.Dispatch<React.SetStateAction<string | null>>;
  address: string | null;
  setAddress: React.Dispatch<React.SetStateAction<string | null>>;
  latitude: number | string | null;
  setLatitude: React.Dispatch<React.SetStateAction<string | number |null>>;
  longitude: number | string | null;
  setLongitude: React.Dispatch<React.SetStateAction<string | number | null>>;
  addressComponents: Record<string, string> | null;
  setAddressComponents: React.Dispatch<React.SetStateAction<Record<string, string> | null>>;
  reportId: string | null;
  setReportId: React.Dispatch<React.SetStateAction<string | null>>;
  status: string | null;
  setStatus: React.Dispatch<React.SetStateAction<string | null>>;
  createdAt: string | null;
  setCreatedAt: React.Dispatch<React.SetStateAction<string | null>>;
  redeemedAt: string | null;
  setRedeemedAt: React.Dispatch<React.SetStateAction<string | null>>;
  clearReportContext: () => void;
}

const ReportContext = createContext<ReportContextProps | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [landGeometry, setLandGeometry] = useState<number[][]>([]);
  const [reportSize, setReportSize] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | string | null>(null);
  const [longitude, setLongitude] = useState<number | string | null>(null);
  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [redeemedAt, setRedeemedAt] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  const clearReportContext = () => {
    setReportId(null);
    setAddress(null);
    setLatitude(null);
    setLongitude(null);
    setLandGeometry([]);
    setAddressComponents(null);
    setStatus(null);
    setRedeemedAt(null);
    setCreatedAt(null);
    setReportSize(null);
  };
    
  // Load initial values from localStorage once the component is mounted
  useEffect(() => {
    try {
      const storedLandGeometry = localStorage.getItem('landGeometry');
      if (storedLandGeometry) setLandGeometry(JSON.parse(storedLandGeometry));

      const storedReportSize = localStorage.getItem('reportSize');
      if (storedReportSize) setReportSize(storedReportSize);
        
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

      const storedRedeemedAt = localStorage.getItem('redeemedAt');
      if (storedRedeemedAt) setRedeemedAt(storedRedeemedAt);

      const storedCreatedAt = localStorage.getItem('createdAt');
      if (storedCreatedAt) setCreatedAt(storedCreatedAt);
        
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
    reportSize !== null
      ? localStorage.setItem('reportSize', reportSize)
      : localStorage.removeItem('reportSize');
  }, [reportSize]);
    
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

  useEffect(() => {
    redeemedAt !== null
      ? localStorage.setItem('redeemedAt', redeemedAt)
      : localStorage.removeItem('redeemedAt');
  }, [redeemedAt]);

  useEffect(() => {
    createdAt !== null
      ? localStorage.setItem('createdAt', createdAt)
      : localStorage.removeItem('createdAt');
  }, [createdAt]);

  const value = useMemo(
    () => ({
      landGeometry,
      setLandGeometry,
      reportSize,
      setReportSize,
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
      redeemedAt,
      setRedeemedAt,
      createdAt,
      setCreatedAt,
      clearReportContext,
    }),
    [landGeometry, reportSize,address, latitude, longitude, addressComponents, reportId, status, redeemedAt, createdAt]
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
