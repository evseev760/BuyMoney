import { Avatar } from "components/Avatar";
import Price from "components/Price";
import styled, { css, DefaultTheme } from "styled-components";
import StarIcon from "@mui/icons-material/Star";
import { CurrentUser } from "models/Auth";
import { User } from "models/User";
import { Skeleton } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
interface UserInfoProps {
  currentUser?: CurrentUser | User;
  textDescription?: string;
}
export const UserInfo = (props: UserInfoProps) => {
  const { t } = useTranslation();
  const { currentUser, textDescription } = props;
  return currentUser ? (
    <StyledContainer>
      <Avatar avatar={currentUser.avatar} size={60} />
      <Title>{currentUser.nickname}</Title>
      <SecondaryText>{textDescription}</SecondaryText>
      <StatisticContainer>
        <StatisticBlok>
          <StatisticValue>
            <Price value={currentUser.ratings.count} />
          </StatisticValue>
          <StatisticDescription>{t("amountOfDeals")}</StatisticDescription>
        </StatisticBlok>
        <StatisticBlok>
          <StatisticValue>
            <Price value={currentUser.ratings.average} /> <StarIcon />
          </StatisticValue>
          <StatisticDescription>{t("averageRating")}</StatisticDescription>
        </StatisticBlok>
      </StatisticContainer>
    </StyledContainer>
  ) : (
    <UserInfoSkeleton textDescription={!!textDescription} />
  );
};

const UserInfoSkeleton = ({
  textDescription,
}: {
  textDescription: boolean;
}) => (
  <StyledContainer>
    <Skeleton variant="circle" width={60} height={60} />
    <Skeleton variant="text" width={140} height={28} />
    {textDescription && <Skeleton variant="text" width={210} height={20} />}
    <StatisticContainer>
      <StatisticBlok>
        <Skeleton variant="rect" width="100%" height={40} />
        <Skeleton variant="text" width="60%" />
      </StatisticBlok>
      <StatisticBlok>
        <Skeleton variant="rect" width="100%" height={40} />
        <Skeleton variant="text" width="60%" />
      </StatisticBlok>
    </StatisticContainer>
  </StyledContainer>
);

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
const Title = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 18px;
  `}
`;
const SecondaryText = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 14px;
    text-align: center;
    max-width: 210px;
    white-space: normal;
  `}
`;
const StatisticContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;
const StatisticBlok = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    padding: 16px;
    background-color: ${theme.palette.background.secondary};
    border-radius: 12px;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    flex-basis: 100%;
  `}
`;
const StatisticValue = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    font-size: 18px;
    color: ${theme.palette.text.primary};
    display: flex;
    gap: 8px;
    align-items: center;
    & svg {
      fill: ${theme.palette.button.primary};
    }
  `}
`;
const StatisticDescription = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    font-size: 14px;
    color: ${theme.palette.text.secondary};
    white-space: normal;
  `}
`;
