import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { MainContainer } from "../components/Containers/MainContainer";
import Registration from "../pages/Auth/Registration";
import Login from "../pages/Auth/Login";
import { Offers } from "pages/Offers";
import { useAppSelector } from "../hooks/redux";
import { Offer } from "../pages/OfferOld/Offer/Offer";
import { Mainpage } from "../pages/MainPage";
import { CreateOffer } from "pages/CreateOffer";

export enum RouteNames {
  MAIN = "/",
  OFFERS = "/offers",
  OFFER = "/offer",
  ADD_OFFER = "/addOffer",
  SETTINGS = "/settings",
}

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
                <Mainpage />
              </MainContainer>
            }
          />
          <Route
            path={RouteNames.OFFERS}
            element={
              <MainContainer>
                <Offers />
              </MainContainer>
            }
          />
          <Route
            path={RouteNames.ADD_OFFER}
            element={
              <MainContainer>
                <CreateOffer />
              </MainContainer>
            }
          />
          <Route path={`${RouteNames.OFFER}/:id`} element={<></>} />
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
