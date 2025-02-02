import { createContext } from 'react';
import type {Cart} from '@/types/Cart';

export const defaultCart: Cart = {
  quantity: 0,
  couponId: null,
  priceId: null,
  customerId: null,
  size: null,  
  sessionId: null,
};

export interface CartContextType extends Cart {
  handleUpdate: (cart: Cart) => void;
}

export const CartContext = createContext<CartContextType>({
  ...defaultCart,
  handleUpdate: () => {},
});