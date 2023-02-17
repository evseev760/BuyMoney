import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));
interface ICustomizedSnackbars {
  severity: "error" | "warning" | "info" | "success";
  text: string;
  onClose?: () => void;
}
export const CustomizedSnackbars = (props: ICustomizedSnackbars) => {
  const { severity, text, onClose } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    onClose && onClose();
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {text}
        </Alert>
      </Snackbar>
    </div>
  );
};
