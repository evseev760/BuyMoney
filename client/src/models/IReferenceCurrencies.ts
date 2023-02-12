export interface IReferenceCurrency {
  uuid: string;
  type: string;
  iconUrl: string;
  name: string;
  symbol: string;
  sign: string;
}
export interface IReferenceCurrencies {
  data: {
    currencies: IReferenceCurrency[];
    stats: {
      total: number;
    };
  };
}
