import { Avatar } from "components/Avatar";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useTg } from "hooks/useTg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import styled, { css, DefaultTheme } from "styled-components";
import StarIcon from "@mui/icons-material/Star";
import Price from "components/Price";
import ListDividers from "components/List";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Switch } from "@material-ui/core";
import { fetchMyOffers } from "store/reducers/offer/ActionCreators";
import { OfferView } from "components/OfferView";
import { NoResults } from "components/NoResults";
import { OfferViewSkeleton } from "components/OfferView/Skeleton";
import { StyledSwitch } from "components/StyledSwitch";

export const MyOffers = () => {
  const { currentUser } = useAppSelector((state) => state.authReducer);
  const { myOffers, offersIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );
  const { price } = useAppSelector((state) => state.currencyReducer);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOn, setIsOn] = useState<boolean>(true);
  const { onToggleBackButton, setBackButtonCallBack, offBackButtonCallBack } =
    useTg();
  const backButtonHandler = () => navigate(RouteNames.MAIN);

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    dispatch(fetchMyOffers());
    return () => {
      offBackButtonCallBack(backButtonHandler);
    };
  }, []);
  const handleChangeSwitch = (value: boolean) => {
    setIsOn(value);
  };
  const listArr = [
    {
      label: "Настройки аккаунта",
      icon: <PersonIcon />,
      handleClick: () => navigate(RouteNames.ACCOUNTSETTINGS),
      value: <ArrowForwardIosIcon />,
    },

    {
      label: "Торги",
      icon: <PublishedWithChangesIcon />,
      handleClick: () => {},
      value: (
        <StyledSwitch
          isOn={isOn}
          handleChangeSwitch={(e: any) => handleChangeSwitch(e.target.checked)}
        />
      ),
    },
  ];
  return (
    <StyledContainer>
      <Avatar avatar={currentUser.avatar} size={60} />
      <Title>{currentUser.nickname}</Title>
      <SecondaryText>
        Это имя будет вашим ID для операций в приложении
      </SecondaryText>
      <StatisticContainer>
        <StatisticBlok>
          <StatisticValue>
            <Price value={currentUser.ratings.count} />
          </StatisticValue>
          <StatisticDescription>Количество сделок</StatisticDescription>
        </StatisticBlok>
        <StatisticBlok>
          <StatisticValue>
            <Price value={currentUser.ratings.average} /> <StarIcon />
          </StatisticValue>
          <StatisticDescription>Средняя оценка</StatisticDescription>
        </StatisticBlok>
      </StatisticContainer>
      <ListDividers listArr={listArr} />
      <div>
        <Title>Мои объявления</Title>
      </div>

      {offersIsLoading || price.isLoading ? (
        <Container>
          <OfferViewSkeleton />
        </Container>
      ) : (
        <Container>
          {myOffers.length ? (
            myOffers.map((offer) => (
              <OfferView key={offer._id} offer={offer} isMy />
            ))
          ) : (
            <NoResults />
          )}
        </Container>
      )}
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
const SecondaryText = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 14px;
    text-align: center;
    max-width: 210px;
    white-space: normal;
  `}
`;
const StatisticContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;
const StatisticBlok = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    padding: 16px;
    background-color: ${theme.palette.background.secondary};
    border-radius: 12px;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    flex-basis: 100%;
  `}
`;
const StatisticValue = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    font-size: 18px;
    color: ${theme.palette.text.primary};
    display: flex;
    gap: 8px;
    align-items: center;
    & svg {
      fill: ${theme.palette.button.primary};
    }
  `}
`;
const StatisticDescription = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    font-size: 14px;
    color: ${theme.palette.text.secondary};
    white-space: normal;
  `}
`;
// const StyledSwitch = styled(Switch)`
//   ${({ theme }: { theme: DefaultTheme }) => css`
//     .MuiSwitch-colorSecondary.Mui-checked {
//       color: ${theme.palette.button.primary};
//     }
//     .MuiSwitch-switchBase {
//       color: ${theme.palette.button.secondary};
//     }
//     .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
//       background-color: ${theme.palette.text.secondary};
//     }
//     .MuiSwitch-track {
//       background-color: ${theme.palette.background.secondary};
//     }
//   `}
// `;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
