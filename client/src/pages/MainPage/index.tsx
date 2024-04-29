import { useEffect, useState } from "react";
import { useTg } from "hooks/useTg";
import { ActionButton } from "components/Button";
import styled from "styled-components";
import ListDividers from "components/List";

import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import { useAppDispatch } from "hooks/redux";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "router";
import { TonConnectButton } from "@tonconnect/ui-react";

export const Mainpage = () => {
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const { onToggleMainButton, onToggleBackButton, onToggleSettingsButton } =
  //   useTg();

  // useEffect(() => {
  //   // onToggleMainButton(() => setValue("Mane done"));
  //   // onToggleSettingsButton(() => setValue("Settings"));
  //   // onToggleBackButton();
  //   // dispatch(fetchPrice(CryptoCurrency.USDT, FiatCurrency.THB));
  // }, []);

  const listArr = [
    {
      label: "Мои обьявления",
      icon: <PersonOutlineOutlinedIcon />,
      handleClick: () => {},
    },
    {
      label: "Уведомления",
      icon: <NotificationsNoneOutlinedIcon />,
      handleClick: () => {},
    },
    {
      label: "FAQ",
      icon: <LiveHelpOutlinedIcon />,
      handleClick: () => {},
    },
  ];

  return (
    <MainPageContainer className="mainPage_container">
      <Title>P2P маркет наличных</Title>
      <Description>
        Покупайте и продавайте наличные где бы вы ни были
      </Description>
      <TonConnectButton />
      <ButtonsContainer className="mainPage_buttonsContainer">
        <ActionButton
          text="Купить"
          handleClick={() => navigate(RouteNames.OFFERS)}
          icon={<AccountBalanceWalletOutlinedIcon />}
        />
        <ActionButton
          text="Продать"
          handleClick={() => navigate(RouteNames.ADD_OFFER)}
          icon={<SellOutlinedIcon />}
        />
      </ButtonsContainer>
      <ListDividers listArr={listArr} />
    </MainPageContainer>
  );
};

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.h2`
  text-align: center;
`;

const Description = styled.p`
  max-width: 260px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 32px 16px 16px;
  width: 100%;
`;
