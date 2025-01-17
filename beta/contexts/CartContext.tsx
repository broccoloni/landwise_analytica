'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

interface CartContextProps {
  quantity: number | null;
  setQuantity: React.Dispatch<React.SetStateAction<number | null>>;
  couponId: string | null;
  setCouponId: React.Dispatch<React.SetStateAction<string | null>>;
  customerId: string | null;
  setCustomerId: React.Dispatch<React.SetStateAction<string | null>>;
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [quantity, setQuantity] = useState<number | null>(null);
  const [couponId, setCouponId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
    
  useEffect(() => {
    const storedQuantity = localStorage.getItem('reportQuantity');
    if (storedQuantity && !isNaN(Number(storedQuantity))) {
      setQuantity(parseInt(storedQuantity));
    }

    const storedCouponId = localStorage.getItem('couponId');
    if (storedCouponId) {
      setCouponId(storedCouponId);
    }

    const storedCustomerId = localStorage.getItem('customerId');
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
    }

    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }

  }, []);

  // Sync state changes with localStorage
  useEffect(() => {
    if (quantity !== null) {
      localStorage.setItem('reportQuantity', quantity.toString());
    } else {
      localStorage.removeItem('reportQuantity');
    }
  }, [quantity]);

  useEffect(() => {
    if (couponId !== null) {
      localStorage.setItem('couponId', couponId);
    } else {
      localStorage.removeItem('couponId');
    }
  }, [couponId]);

  useEffect(() => {
    if (customerId !== null) {
      localStorage.setItem('customerId', customerId);
    } else {
      localStorage.removeItem('customerId');
    }
  }, [customerId]);

  useEffect(() => {
    if (sessionId !== null) {
      localStorage.setItem('sessionId', sessionId);
    } else {
      localStorage.removeItem('sessionId');
    }
  }, [sessionId]);

  const value = useMemo(
    () => ({ 
      quantity, 
      setQuantity, 
      couponId,
      setCouponId,
      customerId,
      setCustomerId,
      sessionId,
      setSessionId
    }), [quantity, couponId, customerId, sessionId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
