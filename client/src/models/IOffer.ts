import { User } from "./User";

export interface DeliveryValues {
  isDelivered?: boolean;
  price?: number;
  distance?: number;
}

export interface OfferData {
  seller: string;
  sellerData: User;
  currency: string;
  forPayment: string;
  typeOfPrice: string;
  interestPrice: number;
  price: number;
  quantity: number;
  minQuantity: number;
  delivery: DeliveryValues;
  distance?: number;
  paymentMethods?: string[];
  comment?: string;
  applications: string[];
  id?: string;
  _id: string;
}
export interface EmptyOfferData {
  currency?: string;
  forPayment?: string;
  typeOfPrice?: string;
  price?: number;
  interestPrice?: number;
  quantity?: number;
  minQuantity?: number;
  delivery: DeliveryValues;
  paymentMethods?: string[];
  comment?: string;
}
