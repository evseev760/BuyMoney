import { TextareaAutosize } from "@material-ui/core";
import styled, { css, DefaultTheme } from "styled-components";

interface TextareaProps {
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
}

export const Textarea = (props: TextareaProps) => {
  const { placeholder, onChange, value } = props;
  return (
    <>
      <StyledTextareaAutosize
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxRows={4}
        maxLength={500}
      />
    </>
  );
};
const StyledTextareaAutosize = styled(TextareaAutosize)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.primary};
    color: ${theme.palette.text.primary};
    border-radius: 12px;
    margin: 16px;
    outline: none;
    padding: 16px;
    border: none;
  `}
`;
