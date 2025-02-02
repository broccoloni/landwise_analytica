import type {FC, ReactNode} from 'react';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import type {Cart} from '@/types/Cart';
import {defaultCart, CartContext} from './CartContext';

const STORAGE_KEY = 'landwise.analytica.cart';

const restoreCart = (): Cart | null => {
  try {
    const restored: string | null = localStorage.getItem(STORAGE_KEY);
    return restored ? JSON.parse(restored) : null;
  } catch (err) {
    console.error('Failed to restore cart:', err);
    return null;
  }
};

const storeCart = (cart: Cart): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to store cart:', err);
  }
};

interface CartProviderProps {
  children?: ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [state, setState] = useState<Cart>(defaultCart);

  useEffect(() => {
    const restored = restoreCart();
    if (restored) {
      setState((prevState) => ({ 
        ...prevState, 
        ...restored,
        isInitialized: true,
      }));
    }
  }, []);

  const handleUpdate = (cart: Cart): void => {
    setState((prevState) => {
      storeCart({
        ...cart,
      });

      return {
        ...prevState,
        ...cart,
      };
    });
  };

  return (
    <CartContext.Provider 
      value={{ 
        ...state, 
        handleUpdate 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

