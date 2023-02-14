import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Header from "../Header";

export default ({ ...props }) => {
  const { children } = props;
  return (
    <div>
      <Header />
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">{children}</Container>
      </React.Fragment>
    </div>
  );
};
