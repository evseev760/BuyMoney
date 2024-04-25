import { IUser } from "./IUser";
import { IMessage } from "./IMessage";
import { CryptoCurrency, FiatCurrency } from "./Currency";

export interface DeliveryValues {
  isDelivered?: boolean;
  price?: number;
  distance?: number;
}

export interface IOffer {
  mainUser?: IUser;
  currency: string;
  forPayment: string;
  isFixPrice: string;
  price: number;
  quantity: number;
  minQuantity: number;
  delivery: DeliveryValues;
  _id?: string;
}
export interface EmptyOfferData {
  currency?: string;
  forPayment?: string;
  isFixPrice?: string;
  price?: number;
  interestPrice?: number;
  quantity?: number;
  minQuantity?: number;
  delivery: DeliveryValues;
}
