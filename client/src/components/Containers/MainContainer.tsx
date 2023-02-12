import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

export default ({ ...props }) => {
  const { children } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">{children}</Container>
    </React.Fragment>
  );
};
