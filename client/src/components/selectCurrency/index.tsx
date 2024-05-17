import { Select } from "components/Select";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { SelectItem } from "utils/Currency";
import { setNewOffer } from "store/reducers/offer/ActionCreators";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTheme } from "styled-components";

interface CurrencySelectProps {
  array: SelectItem[];
  currentValue?: string | string[];
  handleSelect: (value: string) => void;
}

export const CurrencySelect = (props: CurrencySelectProps) => {
  const { array, handleSelect, currentValue } = props;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { newOffer } = useAppSelector((state) => state.offerReducer);
  dispatch(setNewOffer(newOffer));

  const isCheched = (value: string) => {
    if (typeof currentValue === "string") {
      return currentValue === value;
    } else {
      return currentValue?.includes(value);
    }
  };

  const getList = () => {
    return array.map((item) => ({
      ...item,
      handleClick: () => handleSelect(item.code),
      value: isCheched(item.code) ? (
        <CheckCircleOutlineIcon sx={{ color: theme.palette.button.primary }} />
      ) : (
        ""
      ),
    }));
  };
  return (
    <>
      <Select list={getList()} />
    </>
  );
};
