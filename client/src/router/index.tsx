import React from "react";
import { Route, Routes } from "react-router-dom";

export enum RouteNames {
  MAIN = "/",
  NEWS = "/news",
}

export default () => (
  <Routes>
    <Route path={RouteNames.MAIN} element={<div style={{ width: "min-content", marginTop: "50px" }}>MAIN</div>} />
    <Route
      path={RouteNames.NEWS}
      element={
        <div style={{ width: "min-content", marginTop: "50px" }}>🅽🅴🆆🆂</div>
      }
    />
  </Routes>
);
