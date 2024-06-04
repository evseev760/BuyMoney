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
        onChange={(e) =>
          e.target.value.length <= 150 && onChange(e.target.value)
        }
        placeholder={placeholder}
        maxRows={7}
        maxLength={150}
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
    font-size: 14px;
    outline: none;
    padding: 16px;
    border: none;
  `}
`;
