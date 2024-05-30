import ListDividers from "components/List";
import { StyledSwitch } from "components/StyledSwitch";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import SocialDistanceOutlinedIcon from "@mui/icons-material/SocialDistanceOutlined";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useNavigate } from "react-router-dom";
import { useTg } from "hooks/useTg";
import { RouteNames } from "router";

import { ArrayConfirmButton } from "components/ArrayConfirmButton";
import { Quantity } from "components/Quantity";
import Price from "components/Price";
import { DrawerComponent } from "components/Drawer";
import { PrimaryBtn } from "components/Styles/Styles";
import { UpdateUserData } from "models/Auth";
import { updateUserData } from "store/reducers/auth/ActionCreators";
interface Drawers {
  distance: JSX.Element;
}
type Drawer = "distance" | undefined;

export const AccountSettings = () => {
  const { currentUser } = useAppSelector((state) => state.authReducer);
  const [isAnOffice, setIsAnOffice] = useState<boolean>(currentUser.isAnOffice);
  const [isDelivered, setIsDelivered] = useState<boolean>(
    currentUser?.delivery?.isDelivered
  );
  const [distance, setDistance] = useState<number | undefined>(
    currentUser?.delivery?.distance
  );
  const [currentDrawer, setCurrentDrawer] = useState<Drawer>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { onToggleBackButton, setBackButtonCallBack, offBackButtonCallBack } =
    useTg();
  const backButtonHandler = useCallback(() => {
    if (currentDrawer) {
      setCurrentDrawer(undefined);
    } else {
      navigate(RouteNames.MYOFFERS);
    }
  }, [currentDrawer]);

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    return () => {
      // onToggleBackButton(false);
      offBackButtonCallBack(backButtonHandler);
    };
  }, [currentDrawer]);
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
  const closeDrawer = () => setCurrentDrawer(undefined);

  const listArr = [
    {
      label: "Есть офис",
      icon: <BusinessOutlinedIcon />,
      handleClick: () => setIsAnOffice(!isAnOffice),
      value: (
        <StyledSwitch isOn={!!isAnOffice} handleChangeSwitch={setIsAnOffice} />
      ),
    },

    {
      label: "Есть доставка",
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
      label: "Максимальная дистанция",
      icon: <SocialDistanceOutlinedIcon />,
      handleClick: () => setCurrentDrawer("distance"),
      value: (
        <PrimaryBtn>
          {!!distance && <Price value={distance} />}
          <span>{" km"}</span>
        </PrimaryBtn>
      ),
      disable: !isDelivered,
    },
  ];
  const drawers: Drawers = {
    distance: (
      <>
        <Quantity
          onChange={handleChangeDistance}
          value={distance}
          isValid={true}
          label="Максимальная дистанция"
          currency={"km"}
          focus
        />
        <ArrayConfirmButton handleConfirm={closeDrawer} />
      </>
    ),
  };
  return (
    <>
      <ListDividers listArr={listArr} />
      <DrawerComponent
        isOpen={!!currentDrawer}
        onClose={() => setCurrentDrawer(undefined)}
        component={currentDrawer ? drawers[currentDrawer] : <></>}
      />
      {/* <>
        <Delivery
          deliveryValues={newOffer.delivery}
          onChange={onDeliveryChange}
          currency={getLabel(currencies.data, newOffer.currency)}
          isValid={true}
        />
      </> */}
    </>
  );
};
