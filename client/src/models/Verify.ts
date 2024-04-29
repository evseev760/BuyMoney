export interface TonProof {
  timestamp: string;
  domain: {
    lengthBytes: number;
    value: string;
  };
  signature: string;
  payload: string;
}

export interface TonAccount {
  address: string;
  chain: string;
  walletStateInit: string;
  publicKey: string;
}
