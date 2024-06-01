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
import { OfferViewSkeleton } from "components/OfferView/Skeleton";
import { CurrencySelect } from "components/selectCurrency";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useApplication } from "hooks/useApplication";
import { useMemo, useState } from "react";
import styled, { css, DefaultTheme } from "styled-components";
import { SelectItem, getLabel } from "utils/Currency";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";

type Draver = "dealsType" | undefined;
interface Drawers {
  dealsType: JSX.Element;
}

const MyDealsWrapped = () => {
  const { t } = useTranslation();
  const { currentUser } = useAppSelector((state) => state.authReducer);
  const [currentDrawer, setCurrentDrawer] = useState<Draver>();
  const [dealsType, setDealsType] = useState<string>("active");
  const dispatch = useAppDispatch();
  const {
    myApplications,
    myApplicationsIsloading,
    completeApplication,
    acceptApplication,
    deliteApplication,
    completeApplicationIsLoading,
    deliteApplicationIsLoading,
  } = useApplication();
  const handleDealsType = (value: string) => {
    setDealsType(value);
    changeDrawer(undefined);
  };
  const changeDrawer = (value: Draver) => {
    setCurrentDrawer(value);
  };
  const completeApplicationHandle = (applicationId: string, rating: number) => {
    dispatch(completeApplication({ applicationId, rating }));
  };
  const acceptApplicationHandle = (applicationId: string) => {
    dispatch(acceptApplication({ applicationId }));
  };
  const deliteApplicationHandle = (applicationId: string) => {
    dispatch(deliteApplication({ applicationId }));
  };
  const dealsTypes: SelectItem[] = [
    {
      code: "active",
      label: t("active"),
    },
    {
      code: "completed",
      label: t("completed"),
    },
  ];
  const drawers: Drawers = useMemo(
    () => ({
      dealsType: (
        <CurrencySelect
          handleSelect={handleDealsType}
          currentValue={dealsType}
          array={dealsTypes}
        />
      ),
    }),
    [dealsType, dealsTypes]
  );

  const applicationsArr = useMemo(
    () =>
      myApplications.filter((application) => {
        const isSell = currentUser.id === application.seller;
        return (
          (dealsType === "active" &&
            (application.status === "PENDING" ||
              application.status === "NEW" ||
              (application.status === "CONFIRMATION" &&
                isSell &&
                !application.rating.seller) ||
              (application.status === "CONFIRMATION" &&
                !isSell &&
                !application.rating.buyer))) ||
          (dealsType === "completed" &&
            (application.status === "COMPLETED" ||
              (application.status === "CONFIRMATION" &&
                isSell &&
                application.rating.seller) ||
              (application.status === "CONFIRMATION" &&
                !isSell &&
                application.rating.buyer)))
        );
      }),
    [myApplications, dealsType]
  );
  return myApplicationsIsloading ? (
    <OfferViewSkeleton />
  ) : (
    <MyDealsContainer>
      <ItemContainer>
        {myApplicationsIsloading ? (
          <HeaderSkeleton />
        ) : (
          <StyledHeader
            button
            disableRipple
            onClick={() => changeDrawer("dealsType")}
          >
            <ListItemText primary={t("myDeals")} />
            <StyledValue>
              {getLabel(dealsTypes, dealsType)} <ArrowDropDownIcon />
            </StyledValue>
          </StyledHeader>
        )}
      </ItemContainer>
      <Divider component="li" />
      <ItemContainer>
        {myApplicationsIsloading ? (
          <StyledSkeleton />
        ) : (
          <StyledBody>
            {!applicationsArr.length ? (
              dealsType === "active" ? (
                <Title>{t("noActive")}</Title>
              ) : (
                <Title>{t("noCompleted")}</Title>
              )
            ) : (
              applicationsArr.map((application, index) => (
                <>
                  <ApplicationComponent
                    key={application.offerId + index}
                    application={application}
                    completeApplicationHandle={completeApplicationHandle}
                    acceptApplicationHandle={acceptApplicationHandle}
                    deliteApplicationHandle={deliteApplicationHandle}
                    deliteApplicationIsLoading={deliteApplicationIsLoading}
                    completeApplicationIsLoading={completeApplicationIsLoading}
                  />
                  {applicationsArr.length - 1 !== index && (
                    <Divider component="li" />
                  )}
                </>
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
    /* padding: 0 16px; */
    min-height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & .MuiCollapse-root {
      width: 100%;
    }
  `}
`;
const StyledValue = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.button.primary};
    display: flex;
    gap: 8px;
    align-items: center;
    & svg {
      fill: ${theme.palette.button.primary};
    }
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
    /* min-height: 80px; */
  `}
`;
const HeaderSkeleton = styled(Skeleton)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    flex-grow: 1;
    height: 48px;
  `}
`;
export default MyDealsWrapped;
