import { FilterItem, FilterItemProps } from "components/FilterItem";
import styled from "styled-components";

export const Filter = () => {
  const filterList: FilterItemProps[] = [
    {
      items: [],
      currentValue: "",
      onSelect: () => {},
      label: "",
    },
    {
      items: [],
      currentValue: "",
      onSelect: () => {},
      label: "",
    },
    {
      items: [],
      currentValue: "",
      onSelect: () => {},
      label: "",
    },
    {
      items: [],
      currentValue: "",
      onSelect: () => {},
      label: "",
    },
  ];
  return (
    <Container>
      {filterList.map((item) => (
        <FilterItem {...item} />
      ))}
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  margin-top: 16px;
`;
