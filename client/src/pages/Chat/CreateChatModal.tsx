import React, { useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Fade, Backdrop, Modal, Button } from "@material-ui/core";
import ForumIcon from "@material-ui/icons/Forum";
import TextField from "@material-ui/core/TextField";
import { createChat } from "../../store/reducers/ActionCreators";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { ProgressLine } from "../../components/Loading/ProgressLine";
import { CustomizedSnackbars } from "../../components/SnackBar";

export interface IChatCreateData {
  chatName: string;
  description: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: "10px",
      border: "none",
      outline: "none",
      overflow: "hidden",
      position: "relative",
    },
    paperContainer: {
      padding: theme.spacing(2, 4, 3),
    },
    button: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      cursor: "pointer",
    },
    buttonText: {
      fontWeight: 500,
    },
    submitButton: {
      float: "right",
      margin: theme.spacing(2, 0, 2),
    },
  })
);

export const CreateChatModal = ({ ...props }) => {
  const { onChatCreated } = props;
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState({ chatName: "", description: "" });

  const [errorText, setError] = useState("");
  const { createChatIsLoading, error } = useAppSelector(
    (state) => state.chatReducer
  );

  useEffect(() => {
    setError(error);
  }, [error]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onChatNameChange = (value: any) => {
    setData({ ...data, chatName: value.target.value });
  };
  const onDescriptionChange = (value: any) => {
    setData({ ...data, description: value.target.value });
  };

  const onCreated = () => {
    onChatCreated();
    handleClose();
  };
  const onSubmit = () => {
    validation() && dispatch(createChat(data, onCreated));
  };

  const validation = () => {
    if (!data.chatName) {
      setError('"Chat name" field cannot be empty');
      return false;
    } else if (data.description !== "" && data.description.length < 5) {
      setError("Description is too short");
      return false;
    }

    return true;
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        className={classes.button}
        variant="contained"
        color="primary"
      >
        <ForumIcon />
        <div className={classes.buttonText}>Add chat</div>
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className={classes.paperContainer}>
              <h2 id="transition-modal-title">Creating a chat</h2>
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                label="Chat name"
                onChange={onChatNameChange}
              />
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                label="Description"
                onChange={onDescriptionChange}
              />
              <Button
                className={classes.submitButton}
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                Create
              </Button>
              {errorText && (
                <CustomizedSnackbars
                  severity="error"
                  text={errorText}
                  onClose={() => setError("")}
                />
              )}
            </div>
            {createChatIsLoading && <ProgressLine />}
          </div>
        </Fade>
      </Modal>
    </>
  );
};
