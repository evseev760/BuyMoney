import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { MainContainer } from "components/Containers/MainContainer";
import { useAppSelector } from "hooks/redux";
import { Backdrop, CircularProgress } from "@mui/material";
import { useTheme } from "styled-components";
import { MyOffers } from "pages/MyOffers";
import EditOffer from "pages/EditOffer";
import { AccountSettings } from "pages/AccountSettings";

const Mainpage = lazy(() => import("pages/MainPage"));
const Offers = lazy(() => import("pages/Offers"));
const CreateOffer = lazy(() => import("pages/CreateOffer"));
const Offer = lazy(() => import("pages/Offer"));

export enum RouteNames {
  MAIN = "/",
  OFFERS = "/offers",
  MYOFFERS = "/myOffers",
  OFFER = "/offer",
  ADD_OFFER = "/addOffer",
  SETTINGS = "/settings",
  EDITOFFER = "/editOffer",
  ACCOUNTSETTINGS = "/accountSettings",
}

const Fallback = () => {
  const theme = useTheme();
  return (
    <Backdrop
      invisible
      sx={{ color: theme.palette.button.primary }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export const Router = () => {
  const { isAuth } = useAppSelector((state) => state.authReducer);

  return (
    <>
      {isAuth ? (
        <Routes>
          <Route
            path={RouteNames.MAIN}
            element={
              <MainContainer>
                <Suspense fallback={<Fallback />}>
                  <Mainpage />
                </Suspense>
              </MainContainer>
            }
          />
          <Route
            path={RouteNames.OFFERS}
            element={
              <MainContainer>
                <Suspense fallback={<Fallback />}>
                  <Offers />
                </Suspense>
              </MainContainer>
            }
          />
          <Route
            path={RouteNames.ADD_OFFER}
            element={
              <MainContainer>
                <Suspense fallback={<Fallback />}>
                  <CreateOffer />
                </Suspense>
              </MainContainer>
            }
          />
          <Route
            path={`${RouteNames.EDITOFFER}/:id`}
            element={
              <MainContainer>
                <Suspense fallback={<Fallback />}>
                  <EditOffer />
                </Suspense>
              </MainContainer>
            }
          />
          <Route
            path={`${RouteNames.OFFER}/:id`}
            element={
              <MainContainer>
                <Suspense fallback={<Fallback />}>
                  <Offer />
                </Suspense>
              </MainContainer>
            }
          />
          <Route
            path={RouteNames.MYOFFERS}
            element={
              <MainContainer>
                <Suspense fallback={<Fallback />}>
                  <MyOffers />
                </Suspense>
              </MainContainer>
            }
          />
          <Route
            path={RouteNames.ACCOUNTSETTINGS}
            element={
              <MainContainer>
                <Suspense fallback={<Fallback />}>
                  <AccountSettings />
                </Suspense>
              </MainContainer>
            }
          />
        </Routes>
      ) : (
        <Routes>
          {/* <Route path={RouteNames.MAIN} element={<></>} />
          <Route path={RouteNames.LOGIN} element={<Login />} />
          <Route path={RouteNames.REGISTRATION} element={<Registration />} /> */}
        </Routes>
      )}
    </>
  );
};
