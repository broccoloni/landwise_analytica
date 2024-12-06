'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  // Load initial state from localStorage or fallback to default values
  const [landGeometry, setLandGeometry] = useState<number[][]>(() => {
    const stored = localStorage.getItem('landGeometry');
    return stored ? JSON.parse(stored) : [];
  });

  const [address, setAddress] = useState<string | null>(() => {
    return localStorage.getItem('address') || null;
  });

  const [latitude, setLatitude] = useState<number | null>(() => {
    const stored = localStorage.getItem('latitude');
    return stored ? parseFloat(stored) : null;
  });

  const [longitude, setLongitude] = useState<number | null>(() => {
    const stored = localStorage.getItem('longitude');
    return stored ? parseFloat(stored) : null;
  });

  const [addressComponents, setAddressComponents] = useState<Record<string, string> | null>(() => {
    const stored = localStorage.getItem('addressComponents');
    return stored ? JSON.parse(stored) : null;
  });

  const [reportId, setReportId] = useState<string | null>(() => {
    return localStorage.getItem('reportId') || null;
  });

  // Sync state with localStorage on changes
  useEffect(() => {
    localStorage.setItem('landGeometry', JSON.stringify(landGeometry));
  }, [landGeometry]);

  useEffect(() => {
    if (address !== null) {
      localStorage.setItem('address', address);
    } else {
      localStorage.removeItem('address');
    }
  }, [address]);

  useEffect(() => {
    if (latitude !== null) {
      localStorage.setItem('latitude', latitude.toString());
    } else {
      localStorage.removeItem('latitude');
    }
  }, [latitude]);

  useEffect(() => {
    if (longitude !== null) {
      localStorage.setItem('longitude', longitude.toString());
    } else {
      localStorage.removeItem('longitude');
    }
  }, [longitude]);

  useEffect(() => {
    if (addressComponents !== null) {
      localStorage.setItem('addressComponents', JSON.stringify(addressComponents));
    } else {
      localStorage.removeItem('addressComponents');
    }
  }, [addressComponents]);

  useEffect(() => {
    if (reportId !== null) {
      localStorage.setItem('reportId', reportId);
    } else {
      localStorage.removeItem('reportId');
    }
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
