import numeral from "numeral";
export const Numeral = ({ value }: { value: number }) => {
  const fixNumber = (formattedValue: string) => {
    const [numberPart, suffix] = formattedValue.split(" ");
    const formattedNumberPart = numberPart.includes(".0")
      ? numberPart.replace(".0", "")
      : numberPart;
    return `${formattedNumberPart}${
      suffix.charAt(0).toUpperCase() + suffix.slice(1)
    }`;
  };
  return <>{fixNumber(numeral(value).format("0.0 a"))}</>;
};
