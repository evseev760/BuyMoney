import { OfferView } from "components/OfferView";
import { OfferViewSkeleton } from "components/OfferView/Skeleton";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useTg } from "hooks/useTg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import { fetchOffers } from "store/reducers/ActionCreators";
import styled from "styled-components";

export const Offers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const backButtonHandler = () => navigate(RouteNames.MAIN);
  const { onToggleBackButton } = useTg();
  const { offers, offersIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );

  useEffect(() => {
    dispatch(fetchOffers());
    onToggleBackButton(backButtonHandler, true);
    return () => {
      onToggleBackButton(backButtonHandler, false);
    };
  }, []);
  console.log(11111, offers);
  return (
    <>
      {offersIsLoading ? (
        <Container>
          <OfferViewSkeleton />
          <OfferViewSkeleton />
          <OfferViewSkeleton />
        </Container>
      ) : (
        <Container>
          {offers.map((offer) => (
            <OfferView key={offer._id} offer={offer} />
          ))}
        </Container>
      )}
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
