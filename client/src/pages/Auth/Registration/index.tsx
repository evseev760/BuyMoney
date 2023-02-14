import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../../router";
import { Copyright } from "../../../components/Copyright/Copyright";
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
