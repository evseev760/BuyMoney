import { Drawer, SwipeableDrawer } from "@material-ui/core";
import { useEffect, useState } from "react";
import styled, { DefaultTheme, css, useTheme } from "styled-components";

interface DrawerProps {
  component: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
}

export const DrawerComponent = (props: DrawerProps) => {
  const { component, isOpen, onClose } = props;
  const [visible, setVisible] = useState(isOpen);
  const theme = useTheme();

  const container = document.body;

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <Drawer
      anchor={"bottom"}
      open={visible}
      onClose={handleClose}
      PaperProps={{
        style: { backgroundColor: theme.palette.background.primary },
      }}
    >
      <StyledContainer>{component && component}</StyledContainer>
    </Drawer>
  );
};

const StyledContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    padding: 16px;
    max-height: 60vh !important;
    background-color: ${theme.palette.background.primary} !important;
  `}
`;
