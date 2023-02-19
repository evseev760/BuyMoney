import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { Copyright } from "../../../components/Copyright/Copyright";

import { RouteNames } from "../../../router";
import { fetchRegistration } from "../../../store/reducers/ActionCreators";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Registration() {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state.authReducer);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const goToLogin = () => {
    navigate(RouteNames.LOGIN, { replace: true });
  };
  const onSubmit = () => {
    dispatch(fetchRegistration(formData, navigate));
  };
  const onUserNameChange = (value: any) => {
    setFormData({ ...formData, username: value.target.value });
  };
  const onPasswordChange = (value: any) => {
    setFormData({ ...formData, password: value.target.value });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="filled"
            required
            margin="normal"
            fullWidth
            id="username"
            label="User name"
            autoFocus
            onChange={onUserNameChange}
            value={formData.username}
          />

          <Grid item xs={12}>
            {/*  <TextField*/}
            {/*    variant="outlined"*/}
            {/*    fullWidth*/}
            {/*    id="email"*/}
            {/*    label="Email Address"*/}
            {/*    name="email"*/}
            {/*    autoComplete="email"*/}
            {/*  />*/}
          </Grid>
          <TextField
            variant="filled"
            required
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            onChange={onPasswordChange}
            value={formData.password}
            onKeyDown={(event) => event.code === "Enter" && onSubmit()}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item xs>
              {message}
            </Grid>
            <Grid item>
              <Link onClick={goToLogin} variant="body2">
                Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
