import React, { useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Fade, Backdrop, Modal, Button, TextField } from "@material-ui/core";
import ForumIcon from "@material-ui/icons/Forum";

import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ProgressLine } from "../../../components/Loading/ProgressLine";
import { CustomizedSnackbars } from "../../../components/SnackBar";
import { createOffer } from "../../../store/reducers/ActionCreators";

export interface IOfferCreateData {
  currency: string;
  quantity: number;
  price: number;
  forPayment: string;
  location: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: "10px",
      border: "none",
      outline: "none",
      overflow: "hidden",
      position: "relative",
    },
    paperContainer: {
      padding: theme.spacing(2, 4, 3),
    },
    button: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      cursor: "pointer",
    },
    buttonText: {
      fontWeight: 500,
    },
    submitButton: {
      float: "right",
      margin: theme.spacing(2, 0, 2),
    },
  })
);

export const CreateOfferModal = ({ ...props }) => {
  const { onOfferCreated } = props;
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({
    currency: "",
    quantity: 0,
    price: 0,
    forPayment: "",
    location: "",
  });

  const [errorText, setError] = useState("");
  const { createOfferIsLoading, error } = useAppSelector(
    (state) => state.offerReducer
  );

  useEffect(() => {
    setError(error);
  }, [error]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onCurrencyChange = (value: any) => {
    setData({ ...data, currency: value.target.value });
  };
  const onQuantityChange = (value: any) => {
    setData({ ...data, quantity: value.target.value });
  };
  const onPriceChange = (value: any) => {
    setData({ ...data, price: value.target.value });
  };
  const onForPaymentChange = (value: any) => {
    setData({ ...data, forPayment: value.target.value });
  };
  const onLocationChange = (value: any) => {
    setData({ ...data, location: value.target.value });
  };

  const onCreated = () => {
    onOfferCreated();
    handleClose();
  };
  const onSubmit = () => {
    // validation() && dispatch(createOffer(data, onCreated));
  };

  const validation = () => {
    if (!data.currency) {
      setError("currency field cannot be empty");
      return false;
    } else if (!data.quantity) {
      setError("quantity field cannot be empty");
      return false;
    } else if (!data.price) {
      setError("price field cannot be empty");
      return false;
    } else if (!data.forPayment) {
      setError("forPayment field cannot be empty");
      return false;
    } else if (!data.location) {
      setError("location field cannot be empty");
      return false;
    }

    return true;
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        className={classes.button}
        variant="contained"
        color="primary"
      >
        <ForumIcon />
        <div className={classes.buttonText}>Add offer</div>
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className={classes.paperContainer}>
              <h2 id="transition-modal-title">Creating a offer</h2>
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                label="currency"
                onChange={onCurrencyChange}
                onKeyDown={(event) => event.code === "Enter" && onSubmit()}
              />
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                label="quantity"
                onChange={onQuantityChange}
                onKeyDown={(event) => event.code === "Enter" && onSubmit()}
              />
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                label="price"
                onChange={onPriceChange}
                onKeyDown={(event) => event.code === "Enter" && onSubmit()}
              />
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                label="forPayment"
                onChange={onForPaymentChange}
                onKeyDown={(event) => event.code === "Enter" && onSubmit()}
              />
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                label="location"
                onChange={onLocationChange}
                onKeyDown={(event) => event.code === "Enter" && onSubmit()}
              />
              <Button
                className={classes.submitButton}
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                Create
              </Button>
              {errorText && (
                <CustomizedSnackbars
                  severity="error"
                  text={errorText}
                  onClose={() => setError("")}
                />
              )}
            </div>
            {createOfferIsLoading && <ProgressLine />}
          </div>
        </Fade>
      </Modal>
    </>
  );
};
