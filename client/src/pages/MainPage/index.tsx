import { useEffect } from "react";
import { useTg } from "hooks/useTg";
import { ActionButton } from "components/Button";
import styled, { css, DefaultTheme } from "styled-components";
import ListDividers from "components/List";
import { Animation, Animations } from "components/Animation";

import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useCurrencies } from "hooks/useCurrencies";
import { MyDeals } from "components/MyDeals";
import { useAppSelector } from "hooks/redux";
import { useTranslation } from "react-i18next";

const Mainpage = () => {
  const { currentUser } = useAppSelector((state) => state.authReducer);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { onToggleBackButton } = useTg();
  useCurrencies();
  useEffect(() => {
    onToggleBackButton(false);
  }, []);

  const listArr = [
    {
      label: t("myAccount"),
      icon: <PersonOutlineOutlinedIcon />,
      handleClick: () => {
        navigate(RouteNames.MYOFFERS);
      },
    },

    // {
    //   label: t("notifications"),
    //   icon: <NotificationsNoneOutlinedIcon />,
    //   handleClick: () => {},
    // },
    {
      label: "FAQ",
      icon: <LiveHelpOutlinedIcon />,
      handleClick: () => {},
    },
  ];
  return (
    <MainPageContainer className="mainPage_container">
      <Animation
        type={currentUser?.isSuspicious ? Animations.HELLO : Animations.HELLO}
      />

      <Title>{t("mainTitle")}</Title>
      <Description>{t("mainDescription")}</Description>

      <ButtonContainer>
        <StyledTonConnectButton />
      </ButtonContainer>
      <ButtonsContainer className="mainPage_buttonsContainer">
        <ActionButton
          text={t("buy")}
          handleClick={() => navigate(RouteNames.OFFERS)}
          icon={<AccountBalanceWalletOutlinedIcon />}
        />
        <ActionButton
          text={t("sell")}
          handleClick={() => navigate(RouteNames.ADD_OFFER)}
          icon={<SellOutlinedIcon />}
        />
      </ButtonsContainer>

      <ListDividers listArr={listArr} />
      <MyDeals />
    </MainPageContainer>
  );
};

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 17px;
  margin: 0;
`;

const Description = styled.p`
  max-width: 240px;
  white-space: normal;
  font-size: 13px;
  margin: 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  /* margin: 32px 16px 16px; */
  width: 100%;
`;
const StyledTonConnectButton = styled(TonConnectButton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    & button {
      flex-grow: 1;
      height: 32px;
      border-radius: 12px;
      background-color: ${theme.palette.button.primary} !important;
      & * {
        color: ${theme.palette.buttonText.primary} !important;
      }
      & svg {
        fill: ${theme.palette.buttonText.primary} !important;
      }
    }
  `}
`;
const ButtonContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* padding: 0 16px; */
  `}
`;
export default Mainpage;
