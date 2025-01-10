'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

interface CartContextProps {
  quantity: number | null;
  setQuantity: React.Dispatch<React.SetStateAction<number | null>>;
  priceId: string | null;
  setPriceId: React.Dispatch<React.SetStateAction<string | null>>;
  customerId: string | null;
  setCustomerId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [quantity, setQuantity] = useState<number | null>(null);
  const [priceId, setPriceId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
    
  useEffect(() => {
    const storedQuantity = localStorage.getItem('reportQuantity');
    if (storedQuantity && !isNaN(Number(storedQuantity))) {
      setQuantity(parseInt(storedQuantity));
    }

    const storedPriceId = localStorage.getItem('priceId');
    if (storedPriceId) {
      setPriceId(storedPriceId);
    }

    const storedCustomerId = localStorage.getItem('customerId');
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
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
    if (priceId !== null) {
      localStorage.setItem('priceId', priceId);
    } else {
      localStorage.removeItem('priceId');
    }
  }, [priceId]);

  useEffect(() => {
    if (customerId !== null) {
      localStorage.setItem('customerId', customerId);
    } else {
      localStorage.removeItem('customerId');
    }
  }, [customerId]);

  const value = useMemo(
    () => ({ 
      quantity, 
      setQuantity, 
      priceId,
      setPriceId,
      customerId,
      setCustomerId,
    }), [quantity, priceId, customerId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
