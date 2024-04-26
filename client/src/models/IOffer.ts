import { IUser } from "./IUser";
import { IMessage } from "./IMessage";
import { CryptoCurrency, FiatCurrency } from "./Currency";

export interface DeliveryValues {
  isDelivered?: boolean;
  price?: number;
  distance?: number;
}

export interface OfferData {
  mainUser: IUser;
  currency: string;
  forPayment: string;
  typeOfPrice: string;
  interestPrice: number;
  price: number;
  quantity: number;
  minQuantity: number;
  delivery: DeliveryValues;
  mainUsername: string;
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
}
