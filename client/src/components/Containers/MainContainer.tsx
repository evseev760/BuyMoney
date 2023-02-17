import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Header from "../Header";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      overflow: "hidden",
      marginTop: "25px",
    },
  })
);
export default ({ ...props }) => {
  const classes = useStyles();
  const { children } = props;
  return (
    <div>
      <Header />
      <React.Fragment>
        <CssBaseline />
        <Container className={classes.root} maxWidth="lg">
          {children}
        </Container>
      </React.Fragment>
    </div>
  );
};
