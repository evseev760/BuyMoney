import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import styled, { DefaultTheme, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTg } from "hooks/useTg";
import { RouteNames } from "router";
import { useEffect } from "react";

export const Faq = () => {
  const navigate = useNavigate();
  const { onToggleBackButton, setBackButtonCallBack, offBackButtonCallBack } =
    useTg();
  const backButtonHandler = () => {
    navigate(RouteNames.MAIN);
  };

  useEffect(() => {
    onToggleBackButton(true);
    setBackButtonCallBack(backButtonHandler);
    return () => {
      offBackButtonCallBack(backButtonHandler);
    };
  }, []);
  const { t } = useTranslation();
  const array = [
    { question: t("faq.question1"), answer: t("faq.answer1") },
    { question: t("faq.question2"), answer: t("faq.answer2") },
    { question: t("faq.question3"), answer: t("faq.answer3") },
    { question: t("faq.question4"), answer: t("faq.answer4") },
    { question: t("faq.question5"), answer: t("faq.answer5") },
    { question: t("faq.question6"), answer: t("faq.answer6") },
  ];
  return (
    <div style={{ borderRadius: "12px", overflow: "hidden" }}>
      {array.map((item) => (
        <StyledAccordion elevation={0}>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            {item.question}
          </StyledAccordionSummary>
          <StyledAccordionDetails>{item.answer}</StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </div>
  );
};

const StyledAccordion = styled(Accordion)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary} !important;
    background-color: ${theme.palette.background.secondary} !important;
    & * {
      color: ${theme.palette.text.primary};
      background-color: ${theme.palette.background.secondary};
    }
  `}
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    white-space: normal;
    color: ${theme.palette.text.primary};
    background-color: ${theme.palette.background.secondary};
  `}
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    white-space: normal;
    background-color: ${theme.palette.background.secondary};
    color: ${theme.palette.text.secondary};
  `}
`;
