import SnackbarContent from "@material-ui/core/SnackbarContent";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import cn from "classnames";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      marginTop: "15px",
    },
    messageLayout: {
      borderRadius: "15px",
      background: "#3f51b5",
      display: "inline-block",
      position: "relative",
      minWidth: "200px",
      maxWidth: "calc(100% - 75px)",
      wordWrap: "break-word",
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
    textMessage: {},
  })
);
export const Message = ({ ...props }) => {
  const { quantity, currentUser, user, username, createdAt } = props;
  const classes = useStyles();
  const thatMine = currentUser.id === user;
  return (
    <div className={cn({ [classes.root]: true, [classes.right]: thatMine })}>
      <SnackbarContent
        color="primary"
        className={cn(
          { [classes.rightMessage]: thatMine },
          { [classes.messageLayout]: true }
        )}
        message={
          <div className={classes.messageContainer}>
            <div className={thatMine ? classes.right : undefined}>
              <span
                className={cn({
                  [classes.timeRight]: !thatMine,
                  [classes.timeLeft]: thatMine,
                })}
              >
                {moment.unix(createdAt).format("HH:mm")}
              </span>

              <span>{username}</span>
            </div>
            <div
              className={cn({
                [classes.right]: thatMine,
                [classes.textMessage]: true,
              })}
            >
              {quantity}
            </div>
          </div>
        }
      />
    </div>
  );
};
