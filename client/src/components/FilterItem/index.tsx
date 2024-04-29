import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

export interface FilterItemProps {
  items: any[];
  currentValue: string;
  onSelect: (value: string) => void;
  label: string;
}
export const FilterItem = (props: FilterItemProps) => {
  const { items, currentValue, onSelect, label } = props;
  const handleSelect = (event: any) => {
    onSelect(event.target.value);
  };
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={currentValue}
        label={label}
        onChange={handleSelect}
      >
        {items.map((item) => (
          <MenuItem value={item.value}>{item.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
