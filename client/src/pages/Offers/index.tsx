import { Filter } from "components/Filter";
import { NoResults } from "components/NoResults";
import { OfferView } from "components/OfferView";
import { OfferViewSkeleton } from "components/OfferView/Skeleton";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useCurrencies } from "hooks/useCurrencies";
import { useTg } from "hooks/useTg";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import styled from "styled-components";

export const Offers = () => {
  const navigate = useNavigate();
  const {
    onToggleBackButton,
    setBackButtonCallBack,
    offBackButtonCallBack,
    tg,
  } = useTg();
  const { offers, offersIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );
  const { price } = useAppSelector((state) => state.currencyReducer);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const backButtonHandler = useCallback(() => {
    if (isOpenDrawer) {
      setIsOpenDrawer(false);
      tg.BackButton.show();
    } else {
      navigate(RouteNames.MAIN);
    }
  }, [isOpenDrawer]);

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    return () => {
      offBackButtonCallBack(backButtonHandler);
    };
  }, [isOpenDrawer]);
  return (
    <>
      <Filter drawerCallback={setIsOpenDrawer} isOpenDrawer={isOpenDrawer} />
      {offersIsLoading || price.isLoading ? (
        <Container>
          <OfferViewSkeleton />
          <OfferViewSkeleton />
          <OfferViewSkeleton />
        </Container>
      ) : (
        <Container>
          {offers.length ? (
            offers.map((offer) => <OfferView key={offer._id} offer={offer} />)
          ) : (
            <NoResults />
          )}
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
