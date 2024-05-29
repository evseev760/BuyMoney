import { Divider, List } from "@material-ui/core";
import styled, { css } from "styled-components";
import { ListItemComponent, ListItemProps } from "components/ListItem";

interface listItem {
  label: string;
  icon?: any;
  handleClick: () => void;
  value?: any;
}
interface ListProps {
  listArr: ListItemProps[];
}

export default function ListDividers(props: ListProps) {
  const { listArr } = props;
  return (
    <StyledList aria-label="mailbox folders">
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
  padding: 0;
  overflow: hidden;
  border-color: "divider";
  width: 100%;
`;
