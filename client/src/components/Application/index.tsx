import { Paper } from "@material-ui/core";
import Price from "components/Price";
import { useAppSelector } from "hooks/redux";
import { useCurrencies } from "hooks/useCurrencies";
import { Application } from "store/reducers/application/ApplicationSlice";
import styled, { DefaultTheme, css } from "styled-components";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import DoneIcon from "@mui/icons-material/Done";
import { getLabel } from "utils/Currency";
import { MainButton } from "components/MainButton";
import { Avatar } from "components/Avatar";
import { useTg } from "hooks/useTg";
import { CompliteDialog } from "components/Dialogs/Complite";
import { DeliteDialog } from "components/Dialogs/Delite";

interface ApplicationProps {
  application: Application;
  completeApplicationHandle: (applicationId: string, rating: number) => void;
  acceptApplicationHandle: (applicationId: string) => void;
  deliteApplicationHandle: (applicationId: string) => void;
  completeApplicationIsLoading: boolean | string;
  deliteApplicationIsLoading: boolean | string;
}
export const ApplicationComponent = (props: ApplicationProps) => {
  const {
    application,
    completeApplicationHandle,
    acceptApplicationHandle,
    deliteApplicationHandle,
    completeApplicationIsLoading,
    deliteApplicationIsLoading,
  } = props;

  const { currentUser } = useAppSelector((state) => state.authReducer);
  const { openTelegramLink } = useTg();

  const { forPaymentArr } = useCurrencies();
  const paymentMethod = getLabel(
    forPaymentArr.find((item) => item.code === application.forPayment)
      ?.paymentMethodsList || [],
    application.paymentMethod
  );
  const isSell = currentUser.id === application.seller;
  const goToChat = () => {
    application.partnerData &&
      openTelegramLink(application.partnerData?.username);
  };
  const onComplite = (rating: number) => {
    if (!application._id) return;
    completeApplicationHandle(application._id, rating);
  };
  const onAccept = () => {
    acceptApplicationHandle(application._id);
  };
  const onDelite = () => {
    deliteApplicationHandle(application._id);
  };
  const completeIsLoading = completeApplicationIsLoading === application._id;
  const deliteIsLoading = deliteApplicationIsLoading === application._id;
  const isDisable = completeIsLoading || deliteIsLoading;
  return (
    <>
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
                <StyledLink onClick={goToChat}>Перейти в чат</StyledLink>
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
                <Price value={application.price * application.quantity} />
                {getLabel(forPaymentArr, application.forPayment)}
                <Label>{!!paymentMethod && paymentMethod}</Label>
              </Label>
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
                icon={<DoDisturbAltOutlinedIcon />}
                disabled={isDisable}
                isLoading={deliteIsLoading}
              />
            </>
          )}
          {((application.status === "CONFIRMATION" &&
            isSell &&
            application.rating.seller) ||
            (application.status === "CONFIRMATION" &&
              !isSell &&
              application.rating.buyer)) && (
            <>
              <IconTitle>
                <DoneIcon />
              </IconTitle>
            </>
          )}
          {((application.status === "CONFIRMATION" &&
            isSell &&
            !application.rating.seller) ||
            (application.status === "CONFIRMATION" &&
              !isSell &&
              !application.rating.buyer)) && (
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
                icon={<DoDisturbAltOutlinedIcon />}
                disabled={isDisable}
                isLoading={deliteIsLoading}
              />
            </>
          )}
          {application.status === "NEW" &&
            (isSell ? (
              <MainButton
                handleClick={onAccept}
                text="Принять"
                disabled={isDisable}
                isLoading={completeIsLoading}
              />
            ) : (
              <DeliteDialog
                handleClick={() => {}}
                onConfirm={onDelite}
                text="Удалить"
                disabled={isDisable}
                isLoading={deliteIsLoading}
              />
            ))}
          {application.status === "COMPLETED" && (
            <IconTitle>
              <DoneAllIcon />
            </IconTitle>
          )}
        </Column>
      </ApplicationBody>
    </>
  );
};

const ApplicationBody = styled(Paper)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    color: ${theme.palette.text.primary};
    padding: 8px 16px;
    min-height: 96px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `}
`;
const Label = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.secondary};
    font-size: 14px;
    flex: 1;
    display: flex;
    align-items: center;
    font-weight: 300;
    gap: 8px;
    & * {
      color: ${theme.palette.text.secondary};
    }
  `}
`;
const Value = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 16px;
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 300;
  `}
`;
const IconTitle = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    color: ${theme.palette.text.primary};
    font-size: 14px;
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 300;
    & svg {
      fill: ${theme.palette.button.primary};
      width: 30px;
      height: 30px;
    }
  `}
`;
const IconStatus = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    & svg {
      fill: ${theme.palette.button.primary};
      width: 20px;
      height: 20px;
    }
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
