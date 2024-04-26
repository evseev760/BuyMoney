import React from "react";
import {
  Button,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import StarsIcon from "@material-ui/icons/Stars";
import { IUser } from "../../../models/IUser";

interface IOfferView {
  offer: any;
  user: IUser;
  joinOffer: (id: string) => void;
  classes: any;
}

const useStyles = makeStyles(() => ({
  cardContent: {
    flexGrow: 1,
  },
  cardActions: {
    "& button": {
      marginRight: "auto",
    },
    "& svg": {
      marginRight: "10px",
    },
    "& span": {
      opacity: 0.6,
      marginRight: "10px",
    },
  },
}));

export const OfferView = (props: IOfferView) => {
  const { offer, joinOffer, user } = props;
  const classes = useStyles();
  const thatMine = offer.mainUser === user.id;
  return (
    <>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {offer.offerName}
        </Typography>
        <Typography>{offer.description}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          onClick={() => joinOffer(offer?.id)}
          size="small"
          color="primary"
        >
          Join
        </Button>

        {thatMine && <StarsIcon color="primary" />}
        <span>{offer.mainUsername}</span>
      </CardActions>
    </>
  );
};
