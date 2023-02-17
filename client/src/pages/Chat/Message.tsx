import SnackbarContent from "@material-ui/core/SnackbarContent";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      marginTop: "15px",
    },
    rightMessage: {
      marginLeft: "auto",
      justifyContent: "end",
    },
    right: {
      textAlign: "end",
    },
  })
);
export const Message = ({ ...props }) => {
  const { textMessage, currentUser, user, username } = props;
  const classes = useStyles();
  const thatMine = currentUser._id === user;
  return (
    <div className={classes.root}>
      <SnackbarContent
        color="primary"
        className={thatMine ? classes.rightMessage : undefined}
        message={
          <div>
            <div className={thatMine ? classes.right : undefined}>
              {username}
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
