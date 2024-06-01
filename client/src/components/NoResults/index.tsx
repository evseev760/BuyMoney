import { Animation, Animations } from "components/Animation";
import styled, { css, DefaultTheme } from "styled-components";
interface NoResultsProps {
  text: string;
  noAnimation?: boolean;
}
export const NoResults = (props: NoResultsProps) => {
  const { text, noAnimation } = props;
  return (
    <Container>
      <Title>{text}</Title>
      {!noAnimation && <Animation size={150} type={Animations.OH} />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  align-items: center;
  margin-bottom: 16px;
`;
const Title = styled.p`
  ${({ theme }: { theme: DefaultTheme }) => css`
    max-width: 260px;
    white-space: normal;
    font-size: 16px;
    margin: 0;
    color: ${theme.palette.text.secondary};
    text-align: center;
  `}
`;
