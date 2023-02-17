import React from "react";
import { Route, Routes } from "react-router-dom";
import MainContainer from "../components/Containers/MainContainer";
import Registration from "../pages/Auth/Registration";
import Login from "../pages/Auth/Login";
import Chats from "../pages/Chat/Chats";
import { useAppSelector } from "../hooks/redux";
import { Chat } from "../pages/Chat/Chat";

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
                <Chats />
              </MainContainer>
            }
          />
          <Route
            path={`${RouteNames.MAIN}/:id`}
            element={
              // <MainContainer>
              <Chat />
              // </MainContainer>
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
