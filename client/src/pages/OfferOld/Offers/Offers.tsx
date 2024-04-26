import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Card, makeStyles, Container, Grid } from "@material-ui/core";
import { Circular } from "../../../components/Loading/Circular";
import { CreateOfferModal } from "./CreateOfferModal";
import { OfferView } from "./OfferView";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { RouteNames } from "../../../router";
import { OfferData } from "../../../models/IOffer";
import { WS_URL } from "../../../config";
import { fetchOffers } from "../../../store/reducers/ActionCreators";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    height: "100%",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
}));

export default function Offers() {
  const classes = useStyles();
  const navigate = useNavigate();
  const socket = useRef<any>();
  const dispatch = useAppDispatch();
  const { offers, offersIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );
  const { currentUser } = useAppSelector((state) => state.authReducer);
  useEffect(() => {
    dispatch(fetchOffers());
    socket.current = io(WS_URL, { transports: ["websocket"] });
    socket.current.on("connect", () => {});
    socket.current.on("offerCreated", () => {
      dispatch(fetchOffers());
    });
    socket.current.on("disconnect", () => {});

    return () => {
      socket.current.disconnect();
    };
  }, []);
  const joinOffer = (id: string) => {
    navigate(`${RouteNames.OFFER}/${id}`, { replace: true });
  };

  const onOfferCreated = () => {
    socket.current.emit("offerCreated", {
      userId: currentUser.id,
    });
  };

  return (
    <React.Fragment>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {!offersIsLoading ? (
            [undefined, ...offers].map((offer?: OfferData) => (
              <Grid item key={offer?.id || 1} xs={12} sm={12}>
                <Card className={classes.card}>
                  {offer ? (
                    <OfferView
                      classes={classes}
                      offer={offer}
                      user={currentUser}
                      joinOffer={joinOffer}
                    />
                  ) : (
                    <>
                      <CreateOfferModal onOfferCreated={onOfferCreated} />
                    </>
                  )}
                </Card>
              </Grid>
            ))
          ) : (
            <Circular />
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
