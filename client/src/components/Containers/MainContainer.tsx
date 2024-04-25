import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import styled, { DefaultTheme, css } from "styled-components";

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
        <StyledContainer className={classes.root} maxWidth="lg">
          {children}
        </StyledContainer>
      </>
    </div>
  );
};
const StyledContainer = styled(Container)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.primary};
    color: ${theme.palette.text.primary};
  `}
`;
