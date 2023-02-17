import React, { useEffect, useRef } from "react";

import {
  Card,
  CardActions,
  makeStyles,
  Container,
  Typography,
  Grid,
  CardContent,
  Button,
} from "@material-ui/core";

import { fetchChats, fetchChat } from "../../store/reducers/ActionCreators";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IChat } from "../../models/IChat";
import { CreateChatModal } from "./CreateChatModal";
import { Circular } from "../../components/Loading/Circular";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { WS_URL } from "../../config";

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
  cardContent: {
    flexGrow: 1,
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
    dispatch(fetchChat(id)).then(() => navigate(id, { replace: true }));
    navigate(`/${id}`, { replace: true });
  };

  const onChatCreated = () => {
    {
      socket.current.emit("chatCreated", {
        userId: currentUser._id,
      });
    }
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
                    <>
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {chat.chatName}
                        </Typography>
                        <Typography>{chat.description}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() => joinChat(chat?._id)}
                          size="small"
                          color="primary"
                        >
                          Join
                        </Button>
                      </CardActions>
                    </>
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
