import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { RouteNames } from "../../router";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});
export default function CenteredTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(RouteNames.MAIN);
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
    navigate(newValue, { replace: true });
  };
  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Cryptocurrencies" value={RouteNames.MAIN} />
        <Tab label="News" value={RouteNames.NEWS} />
      </Tabs>
    </Paper>
  );
}
