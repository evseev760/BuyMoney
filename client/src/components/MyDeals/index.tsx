import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { ApplicationComponent } from "components/Application";
import { DrawerComponent } from "components/Drawer";
import { CurrencySelect } from "components/selectCurrency";
import { useApplication } from "hooks/useApplication";
import { useState } from "react";
import styled, { css, DefaultTheme } from "styled-components";
import { SelectItem, getLabel } from "utils/Currency";

type Draver = "dealsType" | undefined;
interface Drawers {
  dealsType: JSX.Element;
}

export const MyDeals = () => {
  const [currentDrawer, setCurrentDrawer] = useState<Draver>();
  const [dealsType, setDealsType] = useState<string>("active");
  const { myApplications, myApplicationsIsloading } = useApplication();
  const handleDealsType = (value: string) => {
    setDealsType(value);
    changeDrawer(undefined);
  };
  const changeDrawer = (value: Draver) => {
    setCurrentDrawer(value);
  };
  const dealsTypes: SelectItem[] = [
    {
      code: "active",
      label: "Активные",
    },
    {
      code: "completed",
      label: "Завершенные",
    },
  ];
  const drawers: Drawers = {
    dealsType: (
      <CurrencySelect
        handleSelect={handleDealsType}
        currentValue={dealsType}
        array={dealsTypes}
      />
    ),
  };
  console.log(555, myApplications);
  return (
    <MyDealsContainer>
      <ItemContainer>
        <StyledHeader
          button
          disableRipple
          onClick={() => changeDrawer("dealsType")}
        >
          <ListItemText primary={"Мои сделки"} />
          <StyledValue>{getLabel(dealsTypes, dealsType)}</StyledValue>
        </StyledHeader>
      </ItemContainer>
      <Divider component="li" />
      <ItemContainer>
        {myApplicationsIsloading ? (
          <StyledSkeleton />
        ) : (
          <StyledBody>
            {!myApplications.length ? (
              <Title>У вас пока нет активных сделок</Title>
            ) : (
              myApplications
                .filter(
                  (application) =>
                    (dealsType === "active" &&
                      (application.status === "PENDING" ||
                        application.status === "NEW")) ||
                    (dealsType === "completed" &&
                      application.status === "COMPLETED")
                )
                .map((application) => (
                  <ApplicationComponent application={application} />
                ))
            )}
          </StyledBody>
        )}
      </ItemContainer>
      <DrawerComponent
        isOpen={!!currentDrawer}
        onClose={() => changeDrawer(undefined)}
        component={currentDrawer ? drawers[currentDrawer] : <></>}
      />
    </MyDealsContainer>
  );
};
const ItemContainer = styled.div`
  position: relative;
  &:first-child {
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }
  &:last-child {
    border-radius: 0 0 12px 12px;
    overflow: hidden;
  }
`;
const MyDealsContainer = styled(List)`
  padding: 0;
  overflow: hidden;
  border-color: "divider";
  width: 100%;
`;
const StyledHeader = styled(ListItem)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    color: ${theme.palette.text.primary};
    cursor: pointer;
    -webkit-user-select: none;
    /* & svg {
      fill: ${theme.palette.button.primary};
    } */
    &:hover {
      background-color: ${theme.palette.background.secondary};
      color: ${theme.palette.text.primary};
      opacity: 0.9;
    }
  `}
`;

const StyledBody = styled(Paper)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    color: ${theme.palette.text.primary};
    padding: 8px 16px;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `}
`;
const StyledValue = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.button.primary};
  `}
`;
const Title = styled.p`
  ${({ theme }: { theme: DefaultTheme }) => css`
    max-width: 260px;
    white-space: normal;
    font-size: 16px;
    margin: 0;
    color: ${theme.palette.text.secondary};
    text-align: center;
  `}
`;
const StyledSkeleton = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    flex-grow: 1;
    height: 48px;
    min-height: 80px;
  `}
`;
