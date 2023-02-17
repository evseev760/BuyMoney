import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      position: "absolute",
      bottom: 0,
    },
  })
);

export const ProgressLine = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress />
    </div>
  );
};
