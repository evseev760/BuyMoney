import Typography from "@material-ui/core/Typography";
import React from "react";

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      YourJourney {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
