import { IUser } from "./IUser";
import { IMessage } from "./IMessage";
import { CryptoCurrency, FiatCurrency } from "../utils/Currency";

export interface DeliveryValues {
  isDelivered?: boolean;
  price?: number;
  distance?: number;
}

export interface OfferData {
  mainUser: string;
  currency: string;
  forPayment: string;
  typeOfPrice: string;
  interestPrice: number;
  price: number;
  quantity: number;
  minQuantity: number;
  delivery: DeliveryValues;
  paymentMethods?: string[];
  comment?: string;
  mainUsername: string;
  mainUserAvatar: string;
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
