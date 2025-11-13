import { Products } from "./products";

export interface CartItem {
    count: number;
    price: number;
    product: Products
}

export interface Cart {
    _id: string,
    cartOwner: string,
    products: CartItem[],
    totalCartPrice: number
}

