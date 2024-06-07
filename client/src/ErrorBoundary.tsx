import React, { Component, ReactNode } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { useTg } from "hooks/useTg";

const GlobalStyle = createGlobalStyle`
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: ${(props) => props.theme.bg_color};
    color: ${(props) => props.theme.text_color};
  }
`;

const Container = styled.div`
  text-align: center;
  padding: 0 16px;
`;

const Title = styled.h3`
  /* font-size: 3rem; */
`;

const Message = styled.p`
  font-size: 1.2rem;
  max-width: 300px;
`;

const ReloadButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: ${(props) => props.theme.button_color};
  color: ${(props) => props.theme.button_text_color};
  border: none;
  cursor: pointer;
  border-radius: 12px;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorScreen = () => {
  const { themeParams, user } = useTg();
  const textRu = {
    title: "Что-то пошло не так",
    message: "Мы уже устраняем проблему, пожалуйста, попробуйте позже",
    button: "Перезагрузить",
  };

  const textEn = {
    title: "Something went wrong",
    message: "We are already fixing this, please try again later",
    button: "Reload",
  };

  const texts = user?.language_code === "ru" ? textRu : textEn;

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <Container>
      <Title>{texts.title}</Title>
      <Message>{texts.message}</Message>
      <ReloadButton onClick={reloadPage}>{texts.button}</ReloadButton>
    </Container>
  );
};

class ErrorBoundary extends Component<
  { children: ReactNode; themeParams: any },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; themeParams: any }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, themeParams } = this.props;

    if (hasError) {
      return (
        <ThemeProvider theme={themeParams}>
          <GlobalStyle />
          <ErrorScreen />
          {/* <Message>
            {error?.name}
            <br />
            {error?.message}
            <br />
            {error?.stack}
          </Message> */}
        </ThemeProvider>
      );
    }

    return children;
  }
}

const ThemedErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { themeParams } = useTg();

  return <ErrorBoundary themeParams={themeParams}>{children}</ErrorBoundary>;
};

export default ThemedErrorBoundary;
