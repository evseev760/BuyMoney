import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Button, Container, TextField } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addMessage, fetchMessages } from "../../store/reducers/ActionCreators";
import { Message } from "./Message";
import { Circular } from "../../components/Loading/Circular";
import { WS_URL } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      minHeight: "calc( 100vh - 25px)",
    },
    container: {
      "& > * > *": {
        background: "#3f51b5",
        maxWidth: 600,
      },
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
    exit: {
      marginLeft: "auto",
      cursor: "pointer",
    },
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      height: "100%",
    },
  })
);

export const Chat = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const socket = useRef<any>();
  const messagesEnd = useRef<any>();
  const { currentChatData, chatIsLoading } = useAppSelector(
    (state) => state.chatReducer
  );
  const { currentUser } = useAppSelector((state) => state.authReducer);
  const { messages } = currentChatData;

  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.current = io(WS_URL, { transports: ["websocket"] });
    socket.current.on("connect", () => {});
    socket.current.on("addMessage", (data: any) => {
      if (data.userId !== currentUser._id) dispatch(fetchMessages(data.chatId));
    });
    socket.current.on("disconnect", () => {});

    return () => {
      socket.current.disconnect();
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const send = () => {
    dispatch(
      addMessage({ chatId: currentChatData._id, textMessage: message }, () => {
        socket.current.emit("addMessage", {
          chatId: currentChatData._id,
          userId: currentUser._id,
        });
      })
    );
    setMessage("");
  };
  const exit = () => {
    navigate("/", { replace: true });
  };
  const scrollToBottom = () => {
    messagesEnd.current &&
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div>
          <div>{currentChatData.chatName}</div>
          <span>{currentChatData.description}</span>
        </div>
        <ExitToAppIcon
          fontSize={"large"}
          onClick={exit}
          className={classes.exit}
          color="primary"
        />
      </div>
      <>
        <Container className={classes.cardGrid} maxWidth="lg">
          {!chatIsLoading ? (
            <div className={classes.container}>
              {messages.map((message) => (
                <Message
                  key={message._id}
                  {...message}
                  currentUser={currentUser}
                />
              ))}
            </div>
          ) : (
            <Circular />
          )}
        </Container>
        <div ref={(element) => (messagesEnd.current = element)} />
      </>
      <div className={classes.controllers}>
        <TextField
          className={classes.textField}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button variant="contained" color="primary" onClick={send}>
          Send
        </Button>
      </div>
    </div>
  );
};
