import { alpha, Divider, Paper } from "@material-ui/core";
import Price from "components/Price";
import { useAppSelector } from "hooks/redux";
import { useCurrencies } from "hooks/useCurrencies";
import { Application } from "store/reducers/application/ApplicationSlice";
import styled, { DefaultTheme, css } from "styled-components";
import { getLabel } from "utils/Currency";
interface ApplicationProps {
  application: Application;
}
export const ApplicationComponent = (props: ApplicationProps) => {
  const { application } = props;
  const { currentUser } = useAppSelector((state) => state.authReducer);

  const { forPaymentArr } = useCurrencies();
  return (
    <>
      <ApplicationBody>
        <div>
          <div>
            <Price value={application.quantity} />
          </div>
          <div>{getLabel(forPaymentArr, application.currency)}</div>
        </div>
        <div>
          <div>
            <Price value={application.price} />
          </div>
          <div>{getLabel(forPaymentArr, application.forPayment)}</div>
        </div>

        <div>{application.status}</div>
      </ApplicationBody>
      <Divider component="li" />
    </>
  );
};

const ApplicationBody = styled(Paper)`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background-color: ${theme.palette.background.secondary};
    color: ${theme.palette.text.primary};
    padding: 8px 16px;
    min-height: 64px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `}
`;
