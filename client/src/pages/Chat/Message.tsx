import SnackbarContent from "@material-ui/core/SnackbarContent";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      marginTop: "15px",

      "& > div": {
        position: "relative",
      },
    },
    rightMessage: {
      marginLeft: "auto",
      justifyContent: "end",
    },
    right: {
      textAlign: "end",
    },
    messageContainer: {
      width: "100%",
      "& > div": {
        display: "flex",
        justifyContent: "space-between",
      },
    },
    timeRight: {
      position: "absolute",
      top: 10,
      right: 10,
    },
    timeLeft: {
      position: "absolute",
      top: 10,
      left: 10,
    },
  })
);
export const Message = ({ ...props }) => {
  const { textMessage, currentUser, user, username, createdAt } = props;
  const classes = useStyles();
  console.log(333, moment(createdAt).format("HH:mm"));
  const thatMine = currentUser._id === user;
  return (
    <div className={classes.root}>
      <SnackbarContent
        color="primary"
        className={thatMine ? classes.rightMessage : undefined}
        message={
          <div className={classes.messageContainer}>
            <div className={thatMine ? classes.right : undefined}>
              <span
                className={!thatMine ? classes.timeRight : classes.timeLeft}
              >
                {moment(createdAt).format("HH:mm")}
              </span>

              <span>{username}</span>
            </div>
            <div className={thatMine ? classes.right : undefined}>
              {textMessage}
            </div>
          </div>
        }
      />
    </div>
  );
};
