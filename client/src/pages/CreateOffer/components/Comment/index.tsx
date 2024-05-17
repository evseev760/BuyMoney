import { PriceInputSkeleton } from "../FlexPriceInput/PriceInputSkeleton";
import { Container, StiledTextInput, Title } from "../Styles";

interface CommentInputProps {
  onChange: (value: string) => void;
  value?: string;
  isValid: boolean;
  isLoading?: boolean;
}
export const CommentInput = (props: CommentInputProps) => {
  const { onChange, value, isValid, isLoading } = props;
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };
  return isLoading ? (
    <PriceInputSkeleton />
  ) : (
    <Container>
      <Title>Комментарий</Title>

      <StiledTextInput
        value={value}
        onChange={handleChange}
        placeholder="Уточните детали, если нужно"
        isValid={isValid}
      />
    </Container>
  );
};
