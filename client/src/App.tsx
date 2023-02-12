import React from "react";
import Router from "./router";
import Header from "./components/Header";
import MainContainer from "./components/Containers/MainContainer";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Header />
      <MainContainer>
        <Router />
      </MainContainer>
    </div>
  );
}

export default App;
