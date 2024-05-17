import { Route, Routes } from "react-router-dom";
import { MainContainer } from "../components/Containers/MainContainer";

import { Offers } from "pages/Offers";
import { useAppSelector } from "../hooks/redux";
import { Mainpage } from "../pages/MainPage";
import { CreateOffer } from "pages/CreateOffer";
import { Offer } from "pages/Offer";

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
          <Route
            path={`${RouteNames.OFFER}/:id`}
            element={
              <MainContainer>
                <Offer />
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
