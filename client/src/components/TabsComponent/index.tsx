import { Tab, Tabs } from "@material-ui/core";
import styled, { css, DefaultTheme } from "styled-components";
interface TabsComponentProps {
  onChange: (value: number) => void;
  value: number;
  array: string[];
}
export const TabsComponent = (props: TabsComponentProps) => {
  const { onChange, value, array } = props;

  return (
    <>
      <StiledTabs value={value}>
        {array.map((label, index) => (
          <Tab
            disableRipple
            label={label}
            onClick={() => onChange(index)}
            value={index}
          />
        ))}
      </StiledTabs>
    </>
  );
};

const StiledTabs = styled(Tabs)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    & .MuiTabs-indicator {
      background-color: ${theme.palette.button.primary};
    }
  `}
`;
