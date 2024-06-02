import styled, { css, DefaultTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { updateUserLocation } from "store/reducers/auth/ActionCreators";
import { Skeleton } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import { getLocationTitle } from "utils/location";

export const LocationComponent = () => {
  const { t } = useTranslation();
  const { currentUser, isLoading } = useAppSelector(
    (state) => state.authReducer
  );
  const dispatch = useAppDispatch();
  const handleSendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const data = JSON.stringify({ latitude, longitude });
          dispatch(updateUserLocation({ latitude, longitude }));
        },
        (error) => {
          console.error(error);
          alert(t("geolocationErrorAlert"));
        }
      );
    } else {
      alert(t("geolocationErrorAlert"));
    }
  };
  return isLoading ? (
    <SkeletonTitle />
  ) : (
    <Container>
      <>
        <MyLocationIcon onClick={handleSendLocation} />
        {currentUser?.location?.Country ? (
          <span onClick={handleSendLocation}>
            {getLocationTitle(currentUser.location)}
          </span>
        ) : (
          <span onClick={handleSendLocation}>{t("sendLocation")}</span>
        )}
      </>
    </Container>
  );
};
const SkeletonTitle = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    && {
      width: 200px;
      height: 18px;
      border-radius: 8px;
      background-color: ${theme.palette.background.secondary};
    }
  `}
`;
const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    gap: 8px;
    align-items: center;
    color: ${theme.palette.text.secondary};
    font-weight: 300;
    width: fit-content;
    cursor: pointer;
    & svg {
      fill: ${theme.palette.button.primary};
    }
  `}
`;
