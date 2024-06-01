import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { MainButton } from "components/MainButton";
import { SecondButton } from "components/SecondButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useState } from "react";
import styled, { css, DefaultTheme } from "styled-components";
import { useTranslation } from "react-i18next";

interface CompliteDialogProps {
  text: string;
  handleClick: () => void;
  onConfirm: (value: number) => void;
  icon?: any;
  disabled?: boolean;
  isLoading?: boolean;
}
export const CompliteDialog = (props: CompliteDialogProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(5);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e: any) => {
    setValue(+e.target.value);
  };
  const handleConfirm = () => {
    handleClose();
    props.onConfirm(value);
  };
  return (
    <>
      <MainButton {...props} handleClick={handleClickOpen} />
      <StyledDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <StyledDialogTitle id="alert-dialog-title">
          {t("rateTheDeal")}
        </StyledDialogTitle>
        <StyledDialogContent>
          <StyledRating
            defaultValue={5}
            value={value}
            precision={1}
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            onChange={handleChange}
          />
        </StyledDialogContent>
        <DialogActions>
          <SecondButton handleClick={handleClose} text={t("cancel")} />
          <MainButton handleClick={handleConfirm} text={t("confirm")} />
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
const StyledDialogContent = styled(DialogContent)`
  display: flex;
  justify-content: center;
`;
const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.button.primary,
  },
  "& .MuiRating-iconHover": {
    color: theme.palette.button.primary,
  },
}));
