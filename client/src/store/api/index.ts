interface IApi {
  auth: {
    auth: string;
    registration: string;
    login: string;
    users: string;
  };
  offer: {
    createOffer: string;
    getOffers: string;
    getOffer: string;
    addProposal: string;
    getProposals: string;
    getPrice: string;
  };
  verify: {
    generatePayload: string;
    checkProof: string;
  };
}
export const api: IApi = {
  auth: {
    auth: "auth/auth",
    registration: "auth/registration",
    login: "auth/login",
    users: "auth/users",
  },
  offer: {
    createOffer: "offer/createOffer",
    getOffers: "offer/getOffers",
    getOffer: "offer/getOffer",
    addProposal: "offer/addProposal",
    getProposals: "offer/getProposals",
    getPrice: "offer/getPrice",
  },
  verify: {
    generatePayload: "verify/generatePayload",
    checkProof: "verify/checkProof",
  },
};
