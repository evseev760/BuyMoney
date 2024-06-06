interface IApi {
  auth: {
    auth: string;
    registration: string;
    login: string;
    users: string;
    updateUserData: string;
    updateUserLocation: string;
    sendPhoneNumberInstructions: string;
    disableTrading: string;
  };
  offer: {
    createOffer: string;
    editOffer: string;
    getOffers: string;
    getMyOffers: string;
    getOffer: string;
    deliteOffer: string;
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
    getCommentsByUserId: string;
    getMyComments: string;
  };
}
export const api: IApi = {
  auth: {
    auth: "api/auth/auth",
    registration: "api/auth/registration",
    login: "api/auth/login",
    users: "api/auth/users",
    updateUserData: "api/auth/updateUserData",
    updateUserLocation: "api/auth/updateUserLocation",
    sendPhoneNumberInstructions: "api/auth/sendPhoneNumberInstructions",
    disableTrading: "api/auth/disableTrading",
  },
  offer: {
    createOffer: "api/api/offer/createOffer",
    editOffer: "api/offer/editOffer",
    getOffers: "api/offer/getOffers",
    getMyOffers: "api/offer/getMyOffers",
    getOffer: "api/offer/getOffer",
    deliteOffer: "api/offer/deliteOffer",
    addProposal: "api/offer/addProposal",
    getProposals: "api/offer/getProposals",
  },
  verify: {
    generatePayload: "api/verify/generatePayload",
    checkProof: "api/verify/checkProof",
    authWallet: "api/verify/authWallet",
  },
  currency: {
    getPrice: "api/currency/getPrice",
    getPriceFiat: "api/currency/getPriceFiat",
    getCurrencies: "api/currency/getCurrencies",
    setCurrencies: "api/currency/setCurrencies",
    getCripto: "api/currency/getCripto",
  },
  application: {
    createApplication: "api/application/createApplication",
    getMyApplications: "api/application/getMyApplications",
    completeApplication: "api/application/completeApplication",
    acceptApplication: "api/application/acceptApplication",
    deliteApplication: "api/application/deliteApplication",
    getCommentsByUserId: "api/application/getCommentsByUserId",
    getMyComments: "api/application/getMyComments",
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
