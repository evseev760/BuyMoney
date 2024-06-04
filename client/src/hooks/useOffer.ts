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
import { getCommentsByUserId } from "store/reducers/application/ActionCreators";

export const useOffer = () => {
  const { lastOfferReqest, offers, offersTimestamp, currentOfferData } =
    useAppSelector((state) => state.offerReducer);
  const dispatch = useAppDispatch();

  const getOffer = (id?: string, userId?: string) => {
    if (!id) return;

    const timestamp = new Date().getTime();
    const needPast = 2 * 60 * 1000;
    if (
      id === lastOfferReqest.id &&
      timestamp - Number(lastOfferReqest.timestamp) < needPast
    )
      return;
    if (
      // id !== currentOfferData?._id &&
      offers.length &&
      timestamp - Number(offersTimestamp) < needPast
    ) {
      const availableOffer = offers.find((item) => item._id === id);
      if (availableOffer) {
        if (userId) dispatch(getCommentsByUserId(userId));
        return dispatch(putOffer(availableOffer));
      }
    }

    try {
      dispatch(fetchOffer(id));
      dispatch(setLastOfferReqest({ id, timestamp }));
      if (userId) dispatch(getCommentsByUserId(userId));
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
