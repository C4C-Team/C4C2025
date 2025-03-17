import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface LocationContextType {
  lat: number | null;
  lng: number | null;
  setLocation: (lat: number, lng: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // this is obtaining the location of the user and storing it in local storage
  useEffect(() => {
    const storedLocation = localStorage.getItem("currentLocation");
    if (storedLocation) {
      const { lat, lng } = JSON.parse(storedLocation);
      setLat(lat);
      setLng(lng);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
  
            setLat(lat);
            setLng(lng);
  
            // Store the location in localStorage
            localStorage.setItem('currentLocation', JSON.stringify({ lat, lng }));
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLat(0);
            setLng(0);
          }
        );
      }
    }
  }, []);
  

  const setLocation = (lat: number, lng: number) => {
    setLat(lat);
    setLng(lng);
    localStorage.setItem('currentLocation', JSON.stringify({ lat, lng }));
  };

  return (
    <LocationContext.Provider value={{ lat, lng, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
