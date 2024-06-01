import { Filter } from "components/Filter";
import { NoResults } from "components/NoResults";
import { OfferView } from "components/OfferView";

import { OfferViewSkeleton } from "components/OfferView/Skeleton";
import { useAppSelector } from "hooks/redux";
import { useTg } from "hooks/useTg";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import styled from "styled-components";
import { useFilter } from "hooks/useFilter";

const Offers = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAppSelector(
    (state) => state.authReducer
  );
  const { t } = useTranslation();
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
    <StyledBody>
      <Filter drawerCallback={setIsOpenDrawer} isOpenDrawer={isOpenDrawer} />
      {offersIsLoading ||
      (price.isLoading && currentUser?.location?.coordinates[0]) ? (
        <Container>
          <OfferViewSkeleton />
          <OfferViewSkeleton />
          <OfferViewSkeleton />
        </Container>
      ) : (
        <Container>
          {currentUser?.location?.coordinates[0] ? (
            offers.length ? (
              offers.map((offer) => <OfferView key={offer._id} offer={offer} />)
            ) : (
              <NoResults text={t("noResults1")} />
            )
          ) : (
            <NoResults text={t("noResults3")} />
          )}
        </Container>
      )}
    </StyledBody>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default Offers;
