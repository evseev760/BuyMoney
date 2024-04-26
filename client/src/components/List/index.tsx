import { Divider, List } from "@material-ui/core";
import styled, { css } from "styled-components";
import { ListItemComponent } from "components/ListItem";

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
  overflow: hidden;
  border-color: "divider";
  width: 100%;
`;
