import { useTranslation } from "react-i18next";
import { PriceInputSkeleton } from "../FlexPriceInput/PriceInputSkeleton";
import { Container, StiledTextInput, Title } from "components/Styles/Styles";

interface CommentInputProps {
  onChange: (value: string) => void;
  value?: string;
  isValid: boolean;
  isLoading?: boolean;
}
export const CommentInput = (props: CommentInputProps) => {
  const { t } = useTranslation();
  const { onChange, value, isValid, isLoading } = props;
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };
  return isLoading ? (
    <PriceInputSkeleton />
  ) : (
    <Container>
      <Title>{t("comment")}</Title>

      <StiledTextInput
        value={value}
        onChange={handleChange}
        placeholder={t("commentPlaceholder")}
        isValid={isValid}
      />
    </Container>
  );
};
