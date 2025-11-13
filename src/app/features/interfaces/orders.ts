import { CartItem } from "./cart";

export interface orderAddress {
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
}

export interface shippingAddress {
    details: string;
    phone: string;
    city: string;
}

export interface Orders {
  shippingAddress: shippingAddress,
  id: number, // order id 
  paymentMethodType: string,
  cartItems: CartItem[],
  shippingPrice: number,
  taxPrice: number,
  totalOrderPrice: number,
  _id: string
}

