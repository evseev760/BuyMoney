export interface Currency {
  label: string;
  code: string;
  paymentMethodsList: PaymentMethod[];
}

interface PaymentMethod {
  label: string;
  code: string;
}
