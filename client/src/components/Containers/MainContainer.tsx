import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import styled, { DefaultTheme, css } from "styled-components";
import { Tabs } from "@material-ui/core";
import { TonConnectButton } from "@tonconnect/ui-react";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      overflow: "hidden",
      marginTop: "25px",
    },
  })
);
export const MainContainer = ({ ...props }) => {
  const classes = useStyles();
  const { children } = props;
  return (
    <div>
      <>
        <StyledTabs orientation="vertical" variant="scrollable">
          <StyledContainer className={classes.root} maxWidth="lg">
            {children}
          </StyledContainer>
        </StyledTabs>
      </>
    </div>
  );
};
const StyledContainer = styled(Container)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.primary};
    color: ${theme.palette.text.primary};
    padding-bottom: 12px;
  `}
`;

const ButtonContainer = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    justify-content: end;
    padding: 0 16px;
  `}
`;
const StyledTabs = styled(Tabs)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    max-height: 100vh;
    & > .MuiTabs-scroller {
      overflow-x: hidden;
    }
  `}
`;
