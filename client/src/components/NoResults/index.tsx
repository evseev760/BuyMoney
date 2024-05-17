import { Animation, Animations } from "components/Animation";
import styled, { css, DefaultTheme } from "styled-components";
export const NoResults = () => {
  return (
    <Container>
      <Title>Активных предложений нет, попробуйте изменить фильтры</Title>
      <Animation size={150} type={Animations.SLEEP} />
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
