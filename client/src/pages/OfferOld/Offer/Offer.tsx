import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import moment from "moment";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Button, Container, TextField, Tooltip } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StarRateIcon from "@material-ui/icons/StarRate";
import { Circular } from "../../../components/Loading/Circular";

import { WS_URL } from "../../../config";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
// import {
//   addProposal,
//   fetchOffer,
//   fetchProposals,
//   leaveTheOffer,
// } from "../../../store/reducers/ActionCreators";
import { Message } from "./Message";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      minHeight: "calc( 100vh - 25px)",
    },
    textField: {
      width: "calc( 100% - 80px)",
      outline: "none",
      marginRight: "10px",
      padding: "0 10px",
      background: "rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
    controllers: {
      marginTop: "auto",
      display: "flex",
      position: "fixed",
      bottom: 0,
      width: "calc(100% - 30px)",
      padding: "10px",
      background: "rgba(255,255,255, 0.9)",
    },
    header: {
      display: "flex",
      position: "fixed",
      top: 0,
      width: "calc(100% - 30px)",
      padding: "10px",
      background: "rgba(255,255,255, 0.8)",
      "& > div > div": {
        fontSize: 24,
      },
      "& > div > span": {
        fontSize: 16,
        opacity: 0.6,
      },
    },
    headerControllers: {
      display: "flex",
      marginLeft: "auto",
      "& span": {
        display: "inline-flex",
      },
    },
    exit: {
      cursor: "pointer",
      padding: "0 15px",
    },
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      height: "100%",
    },
    usersTooltipItem: {
      fontSize: "16px",
      padding: "10px",
    },
    manUser: {
      paddingTop: "8px",

      "& svg": {
        position: "relative",
        top: "-2px",
      },
    },
  })
);

export const Offer = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let { id } = useParams();
  const socket = useRef<any>();
  const messagesEnd = useRef<any>();
  const { currentOfferData, offerIsLoading } = useAppSelector(
    (state) => state.offerReducer
  );
  // console.log(55556, currentOfferData);
  // const { currentUser } = useAppSelector((state) => state.authReducer);
  // const { proposals } = currentOfferData;

  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   id && dispatch(fetchOffer(id));
  //   socket.current = io(WS_URL, { transports: ["websocket"] });
  //   socket.current.on("connect", () => {});
  //   socket.current.on("addMessage", (data: any) => {
  //     if (
  //       data.userId !== currentUser.id &&
  //       data.offerId === currentOfferData.id
  //     )
  //       dispatch(fetchProposals(data.offerId));
  //   });
  //   socket.current.on("disconnect", () => {});

  //   return () => {
  //     dispatch(leaveTheOffer());
  //     socket.current.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   id && dispatch(fetchOffer(id));
  // }, [id]);
  // useEffect(() => {
  //   scrollToBottom();
  // }, [proposals.length]);

  // const send = () => {
  //   if (!message) return;
  //   const createdAt = moment().unix();
  //   dispatch(
  //     addProposal(
  //       { offerId: currentOfferData.id, quantity: +message, createdAt },
  //       () => {
  //         socket.current.emit("addMessage", {
  //           offerId: currentOfferData.id,
  //           userId: currentUser.id,
  //           createdAt,
  //         });
  //       }
  //     )
  //   );
  //   setMessage("");
  // };
  // const exit = () => {
  //   navigate("/", { replace: true });
  // };
  // const scrollToBottom = () => {
  //   messagesEnd.current &&
  //     messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  // };

  // return (
  //   <div className={classes.root}>
  //     <>
  //       <Container className={classes.cardGrid} maxWidth="lg">
  //         {!offerIsLoading ? (
  //           proposals.map((message) => (
  //             <Message
  //               key={message.id}
  //               {...message}
  //               currentUser={currentUser}
  //             />
  //           ))
  //         ) : (
  //           <Circular />
  //         )}
  //       </Container>
  //       <div ref={(element) => (messagesEnd.current = element)} />
  //     </>
  //     <div className={classes.header}>
  //       <div>
  //         <div>{currentOfferData.currency}</div>

  //         <span>{currentOfferData.price}</span>
  //       </div>
  //       <div className={classes.headerControllers}>
  //         <Tooltip
  //           title={currentOfferData.users.map((user) => (
  //             <div className={classes.usersTooltipItem}>{user.username}</div>
  //           ))}
  //           disableHoverListener={currentOfferData.users.length <= 1}
  //           placement="bottom"
  //         >
  //           <span className={classes.manUser}>
  //             <StarRateIcon color="primary" />
  //             {currentOfferData.mainUser?.username}
  //           </span>
  //         </Tooltip>

  //         <ExitToAppIcon
  //           fontSize={"large"}
  //           onClick={exit}
  //           className={classes.exit}
  //           color="primary"
  //         />
  //       </div>
  //     </div>
  //     <div className={classes.controllers}>
  //       <TextField
  //         className={classes.textField}
  //         value={message}
  //         onChange={(event) => setMessage(event.target.value)}
  //         onKeyDown={(event) => event.code === "Enter" && send()}
  //       />
  //       <Button variant="contained" color="primary" onClick={send}>
  //         Send
  //       </Button>
  //     </div>
  //   </div>
  // );
};
