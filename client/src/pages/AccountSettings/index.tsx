import ListDividers from "components/List";
import { StyledSwitch } from "components/StyledSwitch";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import SocialDistanceOutlinedIcon from "@mui/icons-material/SocialDistanceOutlined";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useNavigate } from "react-router-dom";
import { useTg } from "hooks/useTg";
import { RouteNames } from "router";

import { UpdateUserData } from "models/Auth";
import { updateUserData } from "store/reducers/auth/ActionCreators";
import { useTranslation } from "react-i18next";
import styled, { css, DefaultTheme } from "styled-components";
import CurrencyInput from "react-currency-input-field";

export const AccountSettings = () => {
  const { t } = useTranslation();
  const { currentUser } = useAppSelector((state) => state.authReducer);
  const [isAnOffice, setIsAnOffice] = useState<boolean>(currentUser.isAnOffice);
  const [isDelivered, setIsDelivered] = useState<boolean>(
    currentUser?.delivery?.isDelivered
  );
  const [distance, setDistance] = useState<number | undefined>(
    currentUser?.delivery?.distance
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { onToggleBackButton, setBackButtonCallBack, offBackButtonCallBack } =
    useTg();
  const backButtonHandler = () => {
    navigate(RouteNames.MYOFFERS);
  };

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    return () => {
      offBackButtonCallBack(backButtonHandler);
    };
  }, []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      const updateData: UpdateUserData = {
        isAnOffice,
        delivery: {
          isDelivered,
          distance,
        },
      };
      dispatch(updateUserData(updateData));
    } else {
      setIsMounted(true);
    }
  }, [isAnOffice, isDelivered, distance]);

  const handleChangeDistance = (value?: number) => {
    if (value && (value > 999 || value < 1)) return;
    setDistance(value);
  };

  const listArr = [
    {
      label: t("thereIsAnOffice"),
      icon: <BusinessOutlinedIcon />,
      handleClick: () => setIsAnOffice(!isAnOffice),
      value: (
        <StyledSwitch isOn={!!isAnOffice} handleChangeSwitch={setIsAnOffice} />
      ),
    },

    {
      label: t("deliveryAvailable"),
      icon: <DeliveryDiningOutlinedIcon />,
      handleClick: () => setIsDelivered(!isDelivered),
      value: (
        <StyledSwitch
          isOn={!!isDelivered}
          handleChangeSwitch={setIsDelivered}
        />
      ),
    },

    {
      label: t("maximumDistance"),
      icon: <SocialDistanceOutlinedIcon />,
      handleClick: () => {},
      value: (
        <>
          <StiledCurrencyInput
            value={distance || ""}
            onValueChange={(value: any, name: any, values: any) =>
              handleChangeDistance(values.float)
            }
            placeholder={`0`}
            size={28}
            maxLength={3}
          />
          <span>{" km"}</span>
        </>
      ),
      disable: !isDelivered,
    },
  ];

  return (
    <>
      <ListDividers listArr={listArr} />
    </>
  );
};
const StiledCurrencyInput = styled(CurrencyInput)<{ size: number }>`
  ${({ theme, size }: { theme: DefaultTheme; size: number }) => css`
    ::placeholder {
      color: ${theme.palette.text.secondary};
      opacity: 1;
    }

    color: ${size ? theme.palette.button.primary : "red"};
    font-size: 16px;
    max-width: ${size}px;
    background-color: ${theme.palette.background.secondary};
    height: 20px;
    padding: 0;
    outline: none;
    border: none;
  `}
`;
