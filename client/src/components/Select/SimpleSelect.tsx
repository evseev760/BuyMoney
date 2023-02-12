import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
import { IReferenceCurrency } from "../../models/IReferenceCurrencies";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    small: {
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
    },
  })
);
interface ISimpleSelect {
  items: any[];
  itemKey: string;
  label?: string;
  tooltipKey?: string;
  prefix?: string;
  value?: any;
  onChange: (value: IReferenceCurrency) => void;
}

export default function SimpleSelect(props: ISimpleSelect) {
  const { items, label, itemKey, tooltipKey, prefix, onChange, value } = props;
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange(items.find((item) => item[itemKey] === event.target.value));
  };

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        {label && (
          <InputLabel id="demo-simple-select-outlined-label">
            {label}
          </InputLabel>
        )}
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={value[itemKey]}
          onChange={handleChange}
          label={label}
        >
          {items.map((item) => (
            <MenuItem key={item[itemKey]} value={item[itemKey]}>
              <Tooltip
                title={tooltipKey && item[tooltipKey]}
                enterDelay={1000}
                disableFocusListener
                disableTouchListener
                placement="left"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "-webkit-fill-available",
                  }}
                >
                  {prefix && (
                    <Avatar
                      variant="circular"
                      alt={item[itemKey]}
                      src={item[prefix]}
                      classes={{ img: "objectFit-fill" }}
                      className={classes.small}
                    />
                  )}
                  <span>{item[itemKey]}</span>
                </div>
              </Tooltip>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
