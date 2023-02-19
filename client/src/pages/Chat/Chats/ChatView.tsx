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

interface IChatView {
  chat: any;
  user: IUser;
  joinChat: (id: string) => void;
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

export const ChatView = (props: IChatView) => {
  const { chat, joinChat, user } = props;
  const classes = useStyles();
  const thatMine = chat.mainUser === user._id;
  return (
    <>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {chat.chatName}
        </Typography>
        <Typography>{chat.description}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          onClick={() => joinChat(chat?._id)}
          size="small"
          color="primary"
        >
          Join
        </Button>

        {thatMine && <StarsIcon color="primary" />}
        <span>{chat.mainUsername}</span>
      </CardActions>
    </>
  );
};
