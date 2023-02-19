import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { RouteNames } from "../../router";
import { useAppDispatch } from "../../hooks/redux";
import { logOut } from "../../store/reducers/ActionCreators";
import { Button, Tab, Tabs, Paper } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  button: {
    marginLeft: "auto",
  },
});
export default function CenteredTabs() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState(RouteNames.MAIN);
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
    navigate(newValue, { replace: true });
  };
  const logout = () => {
    dispatch(logOut(navigate));
  };
  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Chats" value={RouteNames.MAIN} />
        {/*<Tab label="News" value={RouteNames.NEWS} />*/}
      </Tabs>
      <Button className={classes.button} variant="contained" onClick={logout}>
        Logout
      </Button>
    </Paper>
  );
}
