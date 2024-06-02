import {
  setNewOffer,
  clearNewOffer,
  createOffer,
  updateOffer,
  fetchOffer,
  setLastOfferReqest,
  putOffer,
} from "store/reducers/offer/ActionCreators";
import { useAppDispatch, useAppSelector } from "hooks/redux";

export const useOffer = () => {
  const { lastOfferReqest, offers, offersTimestamp } = useAppSelector(
    (state) => state.offerReducer
  );
  const dispatch = useAppDispatch();

  const getOffer = (id?: string) => {
    if (!id) return;

    const timestamp = new Date().getTime();
    const needPast = 2 * 60 * 1000;
    if (
      id === lastOfferReqest.id &&
      timestamp - Number(lastOfferReqest.timestamp) < needPast
    )
      return;
    let availableOffer;
    if (offers.length && timestamp - Number(offersTimestamp) < needPast) {
      availableOffer = offers.find((item) => item._id === id);
      if (availableOffer) return dispatch(putOffer(availableOffer));
    }

    try {
      dispatch(fetchOffer(id));
      dispatch(setLastOfferReqest({ id, timestamp }));
    } catch (error) {
      return;
    }
  };
  return {
    setNewOffer,
    clearNewOffer,
    createOffer,
    updateOffer,
    fetchOffer,
    getOffer,
  };
};
