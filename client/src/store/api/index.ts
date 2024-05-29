interface IApi {
  auth: {
    auth: string;
    registration: string;
    login: string;
    users: string;
    updateUserData: string;
  };
  offer: {
    createOffer: string;
    editOffer: string;
    getOffers: string;
    getMyOffers: string;
    getOffer: string;
    addProposal: string;
    getProposals: string;
  };
  verify: {
    generatePayload: string;
    checkProof: string;
    authWallet: string;
  };
  currency: {
    getPrice: string;
    getCurrencies: string;
    getCripto: string;
    setCurrencies: string;
    getPriceFiat: string;
  };
  application: {
    createApplication: string;
    getMyApplications: string;
    completeApplication: string;
    acceptApplication: string;
    deliteApplication: string;
  };
}
export const api: IApi = {
  auth: {
    auth: "auth/auth",
    registration: "auth/registration",
    login: "auth/login",
    users: "auth/users",
    updateUserData: "auth/updateUserData",
  },
  offer: {
    createOffer: "offer/createOffer",
    editOffer: "offer/editOffer",
    getOffers: "offer/getOffers",
    getMyOffers: "offer/getMyOffers",
    getOffer: "offer/getOffer",
    addProposal: "offer/addProposal",
    getProposals: "offer/getProposals",
  },
  verify: {
    generatePayload: "verify/generatePayload",
    checkProof: "verify/checkProof",
    authWallet: "verify/authWallet",
  },
  currency: {
    getPrice: "currency/getPrice",
    getPriceFiat: "currency/getPriceFiat",
    getCurrencies: "currency/getCurrencies",
    setCurrencies: "currency/setCurrencies",
    getCripto: "currency/getCripto",
  },
  application: {
    createApplication: "application/createApplication",
    getMyApplications: "application/getMyApplications",
    completeApplication: "application/completeApplication",
    acceptApplication: "application/acceptApplication",
    deliteApplication: "application/deliteApplication",
  },
};

export const auth = () => {
  let headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const walletToken = localStorage.getItem("walletToken");
  if (walletToken) {
    //@ts-ignore
    headers = { ...headers, walletToken: walletToken };
  }

  return { headers };
};
