import { Paper } from "@material-ui/core";
import { Avatar } from "components/Avatar";
import {
  IconStatus,
  IconTitle,
  InfoRow,
  Label,
  Value,
} from "components/Styles/Styles";
import { ReviewDetails } from "store/reducers/application/ApplicationSlice";
import styled, { css, DefaultTheme } from "styled-components";
import { Rating } from "@material-ui/lab";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";

import { useTranslation } from "react-i18next";
import Price from "components/Price";

interface ReviewsProps extends ReviewDetails {}
export const ReviewItem = (props: ReviewsProps) => {
  const { t, i18n } = useTranslation();

  const languages = {
    ru: ru,
    en: enUS,
  };
  const { avatar, nickname, ratings, grade, comment, updatedAt } = props;
  const formatRelativeTime = (unixTimestamp: number) => {
    return formatDistanceToNow(new Date(unixTimestamp), {
      addSuffix: true,
      locale: languages[i18n.language === "ru" ? "ru" : "en"],
    });
  };
  return (
    <Container>
      <InfoRow>
        <Label>
          <AvatarContainer>
            <Avatar avatar={avatar} size={30} />
          </AvatarContainer>
          <Column>
            <span>{nickname}</span>{" "}
            <Label>
              <span>
                <Price value={ratings.average} />
                {` / ${ratings.count} ${t("marks")}`}
              </span>
            </Label>
          </Column>
        </Label>

        <Column style={{ alignItems: "end" }}>
          <StyledRating value={grade} precision={1} readOnly />
          <Label>{formatRelativeTime(updatedAt)}</Label>
        </Column>
      </InfoRow>
      {comment && (
        <Value>
          <CommentContainer>{comment}</CommentContainer>
        </Value>
      )}
    </Container>
  );
};

const Container = styled(Paper)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: calc(100% - 32px);
    background-color: ${theme.palette.background.secondary};
    padding: 16px;
    border-radius: 12px;
  `}
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;

  gap: 4px;
`;
const AvatarContainer = styled.div`
  margin: 0 2px;
`;
const CommentContainer = styled.div`
  white-space: normal;
  word-break: break-all;
`;

const StyledRating = styled(Rating)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    font-size: 16px;
    & .MuiRating-iconFilled {
        color: ${theme.palette.button.primary} !important;
        & * {
            color: ${theme.palette.button.primary} !important;
        }
    }
    "& .MuiRating-iconHover {
        color: ${theme.palette.button.primary} !important;
    }
  `}
`;
