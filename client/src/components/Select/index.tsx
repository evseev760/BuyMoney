import ListDividers from "components/List";
import { any } from "prop-types";
interface SelectProps {
  list: any[];
  handleSelect?: (value: string) => void;
  currentValue?: string;
}
export const Select = (props: SelectProps) => {
  const { list, handleSelect } = props;
  const onChange = (value: string) => {
    handleSelect && handleSelect(value);
  };
  return (
    <>
      <ListDividers listArr={list} />
    </>
  );
};
