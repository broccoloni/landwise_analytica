'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface GoogleMapsContextType {
  googleApiKey: string | null;
  scriptLoaded: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  const fetchGoogleMapsApiKey = async () => {
    try {
      const response = await fetch('/api/getGoogleApiKey');
      const data = await response.json();
      if (data.apiKey) {
        setGoogleApiKey(data.apiKey);
      } else {
        console.error('Failed to retrieve Google Maps API Key');
      }
    } catch (error) {
      console.error('Error fetching Google Maps API key:', error);
    }
  };

  useEffect(() => {
    if (googleApiKey && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    }
  }, [googleApiKey]);

  useEffect(() => {
    fetchGoogleMapsApiKey();
  }, []);

  return (
    <GoogleMapsContext.Provider value={{ googleApiKey, scriptLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};
