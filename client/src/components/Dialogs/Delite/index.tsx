import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { MainButton } from "components/MainButton";
import { SecondButton } from "components/SecondButton";

import { useState } from "react";
import styled, { css, DefaultTheme } from "styled-components";

interface DeliteDialogProps {
  text: string;
  handleClick: () => void;
  onConfirm: () => void;
  icon?: any;
  disabled?: boolean;
  isLoading?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  noBtn?: boolean;
}
export const DeliteDialog = (props: DeliteDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (props?.onClose) {
      props.onClose();
    }
  };

  const handleConfirm = () => {
    handleClose();
    props.onConfirm();
  };
  return (
    <>
      {!props.noBtn && (
        <SecondButton {...props} handleClick={handleClickOpen} />
      )}
      <StyledDialog
        open={open || !!props.isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <StyledDialogTitle id="alert-dialog-title">
          Удалить заявку?
        </StyledDialogTitle>

        <DialogActions>
          <SecondButton handleClick={handleClose} text="Отмена" />
          <MainButton handleClick={handleConfirm} text="Подтвердить" />
        </DialogActions>
      </StyledDialog>
    </>
  );
};
const StyledDialog = styled(Dialog)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    & .MuiDialog-paper {
      background-color: ${theme.palette.background.secondary};
      color: ${theme.palette.text.primary};
      border-radius: 12px;
    }
  `}
`;
const StyledDialogTitle = styled(DialogTitle)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    justify-content: center;
    & * {
      color: ${theme.palette.text.primary};
    }
  `}
`;
