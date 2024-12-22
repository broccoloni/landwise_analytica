'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

interface CartContextProps {
  quantity: number | null;
  setQuantity: React.Dispatch<React.SetStateAction<number | null>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [quantity, setQuantity] = useState<number | null>(null);

  // Load initial values from localStorage once the component is mounted
  useEffect(() => {
    const storedQuantity = localStorage.getItem('reportQuantity');
    if (storedQuantity && !isNaN(Number(storedQuantity))) {
      setQuantity(parseInt(storedQuantity));
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

  const value = useMemo(() => ({ quantity, setQuantity }), [quantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
