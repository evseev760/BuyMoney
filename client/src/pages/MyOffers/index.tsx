import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useTg } from "hooks/useTg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import styled, { css, DefaultTheme } from "styled-components";
import ListDividers from "components/List";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { fetchMyOffers } from "store/reducers/offer/ActionCreators";
import { OfferView } from "components/OfferView";
import { NoResults } from "components/NoResults";
import {
  OfferViewSkeleton,
  ReviewSkeleton,
} from "components/OfferView/Skeleton";
import { StyledSwitch } from "components/StyledSwitch";
import { UserInfo } from "components/UserInfo";
import { useTranslation } from "react-i18next";
import { getMyComments } from "store/reducers/application/ActionCreators";
import { disableTrading } from "store/reducers/auth/ActionCreators";
import { Reviews } from "components/Reviews";
import { TabsComponent } from "components/TabsComponent";

export const MyOffers = () => {
  const { currentUser, disableTradingIsLoading } = useAppSelector(
    (state) => state.authReducer
  );
  const { myOffers, offersIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );
  const { myReviews, reviewsIsLoading } = useAppSelector(
    (state) => state.applicationReducer
  );
  const { price } = useAppSelector((state) => state.currencyReducer);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOn, setIsOn] = useState<boolean>(true);
  const { onToggleBackButton, setBackButtonCallBack, offBackButtonCallBack } =
    useTg();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const backButtonHandler = () => navigate(RouteNames.MAIN);

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    dispatch(fetchMyOffers());
    dispatch(getMyComments());
    return () => {
      offBackButtonCallBack(backButtonHandler);
    };
  }, []);
  const handleChangeSwitch = (value: boolean) => {
    const calback = () => {
      alert(t(value ? "disableTradingOffAlert" : "disableTradingOnAlert"));
    };
    dispatch(disableTrading({ isDisableTrading: !value }, calback));
    setIsOn(value);
  };
  const listArr = [
    {
      label: t("accountSettings"),
      icon: <PersonIcon />,
      handleClick: () => navigate(RouteNames.ACCOUNTSETTINGS),
      value: <ArrowForwardIosIcon />,
    },

    {
      label: t("bargain"),
      icon: <PublishedWithChangesIcon />,
      handleClick: () => {},
      value: (
        <StyledSwitch
          isOn={!currentUser.disableTrading}
          handleChangeSwitch={handleChangeSwitch}
          disabled={disableTradingIsLoading}
        />
      ),
    },
  ];
  const tabsArray = [t("myOffers"), t("myReviews")];

  return (
    <StyledContainer>
      <UserInfo
        currentUser={currentUser}
        textDescription={t("yourIdDescription")}
      />

      <ListDividers listArr={listArr} />
      <div>
        <TabsComponent
          array={tabsArray}
          onChange={setCurrentTab}
          value={currentTab}
        />
      </div>
      <Container>
        {!currentTab ? (
          <>
            {offersIsLoading || price.isLoading ? (
              <OfferViewSkeleton />
            ) : myOffers.length ? (
              myOffers.map((offer) => (
                <OfferView key={offer._id} offer={offer} isMy />
              ))
            ) : (
              <NoResults text={t("noResults2")} noAnimation />
            )}
          </>
        ) : (
          <>
            {reviewsIsLoading ? (
              <ReviewSkeleton />
            ) : myReviews.length ? (
              <Reviews reviewArray={myReviews} />
            ) : (
              <NoResults text={t("noResults5")} noAnimation />
            )}
          </>
        )}
      </Container>
    </StyledContainer>
  );
};
const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
`;
const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 18px;
  `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
