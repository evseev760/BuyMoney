import { Collapse, Paper } from "@material-ui/core";
import Price from "components/Price";
import { useAppSelector } from "hooks/redux";
import { useCurrencies } from "hooks/useCurrencies";
import { Application } from "store/reducers/application/ApplicationSlice";
import styled, { DefaultTheme, css } from "styled-components";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import DoneIcon from "@mui/icons-material/Done";
import { getLabel } from "utils/Currency";
import { MainButton } from "components/MainButton";
import { Avatar } from "components/Avatar";
import { useTg } from "hooks/useTg";
import { CompliteDialog } from "components/Dialogs/Complite";
import { DeliteDialog } from "components/Dialogs/Delite";
import SwipeableListItem from "components/SwipeableListItemProps";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconStatus, IconTitle, Label, Value } from "components/Styles/Styles";

interface ApplicationProps {
  application: Application;
  completeApplicationHandle: (
    applicationId: string,
    rating: number,
    comment: string
  ) => void;
  acceptApplicationHandle: (applicationId: string) => void;
  deliteApplicationHandle: (applicationId: string) => void;
  completeApplicationIsLoading: string[];
  deliteApplicationIsLoading: string[];
}
export const ApplicationComponent = (props: ApplicationProps) => {
  const { t } = useTranslation();
  const {
    application,
    completeApplicationHandle,
    acceptApplicationHandle,
    deliteApplicationHandle,
    completeApplicationIsLoading,
    deliteApplicationIsLoading,
  } = props;

  const { currentUser } = useAppSelector((state) => state.authReducer);
  const { openTelegramLink, isMobile } = useTg();

  const [isOpenDelite, setIsOpenDelite] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (application.shouldDelite) {
      setIsOpen(false);
    }
  }, [application.shouldDelite]);

  const { forPaymentArr } = useCurrencies();
  const paymentMethod = getLabel(
    forPaymentArr.find((item) => item.code === application.forPayment)
      ?.paymentMethodsList || [],
    application.paymentMethod
  );
  const isSell = currentUser.id === application.seller;
  const goToChat = () => {
    application.partnerData &&
      openTelegramLink(
        application.partnerData?.username ||
          application.partnerData?.phoneNumber
      );
  };
  const onComplite = (rating: number, comment: string) => {
    if (!application._id) return;
    completeApplicationHandle(application._id, rating, comment);
  };
  const onAccept = () => {
    acceptApplicationHandle(application._id);
  };
  const onDelite = () => {
    deliteApplicationHandle(application._id);
  };
  const completeIsLoading = completeApplicationIsLoading.includes(
    application._id
  );
  const deliteIsLoading = deliteApplicationIsLoading.includes(application._id);
  const isDisable = completeIsLoading || deliteIsLoading;

  const isConfirmationWaitingForMe =
    (application.status === "CONFIRMATION" &&
      isSell &&
      !application.rating.seller) ||
    (application.status === "CONFIRMATION" &&
      !isSell &&
      !application.rating.buyer);

  return (
    <Collapse in={isOpen}>
      <SwipeableListItem
        onClick={() => setIsOpenDelite(true)}
        isDisabled={application.status === "COMPLETED"}
      >
        <ApplicationBody square>
          <Column style={{ maxWidth: "220px" }}>
            {!!application?.partnerData && (
              <Label>
                <AvatarContainer>
                  <Avatar
                    avatar={application?.partnerData?.avatar || ""}
                    size={26}
                  />
                </AvatarContainer>

                {application?.partnerData?.nickname}

                {(application.status === "PENDING" ||
                  application.status === "CONFIRMATION") && (
                  <StyledLink onClick={goToChat}>{t("goToChat")}</StyledLink>
                )}

                {application.status === "NEW" && (
                  <IconStatus>
                    <FiberNewIcon />
                  </IconStatus>
                )}
              </Label>
            )}

            <IconTitle>
              {isSell ? (
                <SellOutlinedIcon />
              ) : (
                <AccountBalanceWalletOutlinedIcon />
              )}
              <Column style={{ gap: "4px" }}>
                <Value>
                  <Price value={application.quantity} />
                  {getLabel(forPaymentArr, application.currency)}
                </Value>
                <Label>
                  <Price
                    value={(1 / application.price) * application.quantity}
                  />
                  {getLabel(forPaymentArr, application.forPayment)}
                  <Label>{!!paymentMethod && paymentMethod}</Label>
                </Label>
                {isConfirmationWaitingForMe && (
                  <Label>
                    {isSell ? t("buyerConfirmed") : t("sellerConfirmed")}
                  </Label>
                )}
              </Column>
            </IconTitle>
          </Column>

          <Column>
            {application.status === "PENDING" && (
              <>
                <CompliteDialog
                  handleClick={() => {}}
                  onConfirm={onComplite}
                  text=""
                  icon={<DoneIcon />}
                  disabled={isDisable}
                  isLoading={completeIsLoading}
                />
                <DeliteDialog
                  handleClick={() => {}}
                  onConfirm={onDelite}
                  text=""
                  dialogText={t("deleteTheApplication")}
                  isOpen={isOpenDelite}
                  onClose={() => setIsOpenDelite(false)}
                  icon={<DoDisturbAltOutlinedIcon />}
                  disabled={isDisable}
                  isLoading={deliteIsLoading}
                  noBtn={isMobile}
                />
              </>
            )}
            {application.status === "CONFIRMATION" &&
              !isConfirmationWaitingForMe && (
                <>
                  <IconTitle>
                    <DoneIcon />
                  </IconTitle>
                </>
              )}
            {isConfirmationWaitingForMe && (
              <>
                <CompliteDialog
                  handleClick={() => {}}
                  onConfirm={onComplite}
                  text=""
                  icon={<DoneAllIcon />}
                  disabled={isDisable}
                  isLoading={completeIsLoading}
                />

                {/* <DeliteDialog
                handleClick={() => {}}
                onConfirm={onDelite}
                text=""
                icon={<DoDisturbAltOutlinedIcon />}
                disabled={isDisable}
                isLoading={deliteIsLoading}
              /> */}
              </>
            )}
            {application.status === "NEW" &&
              (isSell ? (
                <>
                  <MainButton
                    handleClick={onAccept}
                    text={t("accept")}
                    disabled={isDisable}
                    isLoading={completeIsLoading}
                  />
                  <DeliteDialog
                    handleClick={() => {}}
                    onConfirm={onDelite}
                    text={t("delete")}
                    isOpen={isOpenDelite}
                    dialogText={t("deleteTheApplication")}
                    onClose={() => setIsOpenDelite(false)}
                    // icon={<DoDisturbAltOutlinedIcon />}
                    disabled={isDisable}
                    isLoading={deliteIsLoading}
                    noBtn={isMobile}
                  />
                </>
              ) : (
                <>
                  {isMobile && (
                    <IconTitle style={{ alignItems: "end" }}>
                      <IconStatus>
                        <HourglassTopIcon />
                      </IconStatus>
                    </IconTitle>
                  )}
                  <DeliteDialog
                    handleClick={() => {}}
                    onConfirm={onDelite}
                    text={t("delete")}
                    disabled={isDisable}
                    dialogText={t("deleteTheApplication")}
                    isLoading={deliteIsLoading}
                    isOpen={isOpenDelite}
                    onClose={() => setIsOpenDelite(false)}
                    noBtn={isMobile}
                  />
                </>
              ))}
            {application.status === "COMPLETED" && (
              <IconTitle>
                <DoneAllIcon />
              </IconTitle>
            )}
          </Column>
        </ApplicationBody>
      </SwipeableListItem>
    </Collapse>
  );
};

const ApplicationBody = styled(Paper)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    color: ${theme.palette.text.primary};
    padding: 8px 16px;
    min-height: 96px;
    width: calc(100% - 32px);
    display: flex;
    justify-content: space-between;
    align-items: center;
  `}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`;
const StyledLink = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.link.primary};
  `}
`;
const AvatarContainer = styled.div`
  margin: 0 2px;
`;
