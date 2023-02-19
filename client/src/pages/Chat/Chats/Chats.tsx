import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Card, makeStyles, Container, Grid } from "@material-ui/core";
import { Circular } from "../../../components/Loading/Circular";
import { CreateChatModal } from "./CreateChatModal";
import { ChatView } from "./ChatView";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { RouteNames } from "../../../router";
import { IChat } from "../../../models/IChat";
import { WS_URL } from "../../../config";
import { fetchChats } from "../../../store/reducers/ActionCreators";

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

export default function Chats() {
  const classes = useStyles();
  const navigate = useNavigate();
  const socket = useRef<any>();
  const dispatch = useAppDispatch();
  const { chats, chatsIsLoading } = useAppSelector(
    (state) => state.chatReducer
  );
  const { currentUser } = useAppSelector((state) => state.authReducer);
  useEffect(() => {
    dispatch(fetchChats());
    socket.current = io(WS_URL, { transports: ["websocket"] });
    socket.current.on("connect", () => {});
    socket.current.on("chatCreated", () => {
      dispatch(fetchChats());
    });
    socket.current.on("disconnect", () => {});

    return () => {
      socket.current.disconnect();
    };
  }, []);
  const joinChat = (id: string) => {
    navigate(`${RouteNames.CHAT}/${id}`, { replace: true });
  };

  const onChatCreated = () => {
    socket.current.emit("chatCreated", {
      userId: currentUser._id,
    });
  };

  return (
    <React.Fragment>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {!chatsIsLoading ? (
            [undefined, ...chats].map((chat?: IChat) => (
              <Grid item key={chat?._id || 1} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  {chat ? (
                    <ChatView
                      classes={classes}
                      chat={chat}
                      user={currentUser}
                      joinChat={joinChat}
                    />
                  ) : (
                    <>
                      <CreateChatModal onChatCreated={onChatCreated} />
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
