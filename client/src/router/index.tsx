import React from "react";
import { Route, Routes } from "react-router-dom";
import MainContainer from "../components/Containers/MainContainer";
import Registration from "../pages/Auth/Registration";
import Login from "../pages/Auth/Login";
import { useAppSelector } from "../hooks/redux";

export enum RouteNames {
  MAIN = "/",
  NEWS = "/news",
  REGISTRATION = "/registration",
  LOGIN = "/login",
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
                <div style={{ width: "min-content", marginTop: "50px" }}>
                  MAIN
                </div>
              </MainContainer>
            }
          />
          <Route
            path={RouteNames.NEWS}
            element={
              <MainContainer>
                <div style={{ width: "min-content", marginTop: "50px" }}>
                  🅽🅴🆆🆂
                </div>
              </MainContainer>
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route path={RouteNames.MAIN} element={<></>} />
          <Route path={RouteNames.LOGIN} element={<Login />} />
          <Route path={RouteNames.REGISTRATION} element={<Registration />} />
        </Routes>
      )}
    </>
  );
};
