import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useTg, ThemeParamsProps } from "hooks/useTg";
import styled, { css } from "styled-components";
import { ListItemComponent } from "components/ListItem";

const style = {
  //   borderRadius: 2,
};
interface listItem {
  label: string;
  icon?: any;
  handleClick: () => void;
  value?: any;
}
interface ListProps {
  listArr: listItem[];
}

export default function ListDividers(props: ListProps) {
  const { listArr } = props;
  return (
    <StyledList sx={style} aria-label="mailbox folders">
      {listArr.map((item, index) => (
        <>
          <ListItemComponent {...item} />
          {listArr.length - 1 !== index && <Divider component="li" />}
        </>
      ))}
    </StyledList>
  );
}

const StyledList = styled(List)`
  overflow: hidden;
  border-color: "divider";
  width: 100%;
`;
