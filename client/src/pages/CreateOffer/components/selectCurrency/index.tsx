import { Select } from "components/Select";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { SelectItem } from "models/Currency";
import { setNewOffer } from "store/reducers/ActionCreators";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTheme } from "styled-components";

interface CurrencySelectProps {
  array: SelectItem[];
  currentValue?: string;
  handleSelect: (value: string) => void;
}

export const CurrencySelect = (props: CurrencySelectProps) => {
  const { array, handleSelect, currentValue } = props;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { newOffer } = useAppSelector((state) => state.offerReducer);
  dispatch(setNewOffer(newOffer));

  const getList = () => {
    return array.map((item) => ({
      ...item,
      handleClick: () => handleSelect(item.code),
      value:
        currentValue === item.code ? (
          <CheckCircleOutlineIcon
            sx={{ color: theme.palette.button.primary }}
          />
        ) : (
          ""
        ),
    }));
  };
  return (
    <>
      <Select currentValue={currentValue} list={getList()} />
    </>
  );
};
