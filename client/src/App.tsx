import React, { useEffect } from "react";
import { Router } from "./router";
import "./App.css";
import { fetchAuth } from "./store/reducers/ActionCreators";
import { useAppDispatch } from "./hooks/redux";
import { useNavigate } from "react-router-dom";
function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAuth(navigate));
  }, []);
  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
