import { MainButton } from "components/MainButton";
import DoneIcon from "@mui/icons-material/Done";
import styled from "styled-components";
import { Collapse } from "@material-ui/core";
import { useEffect, useState } from "react";

export const ArrayConfirmButton = ({
  handleConfirm,
}: {
  handleConfirm?: () => void;
}) => {
  const [isOpen, setIsopen] = useState(false);
  useEffect(() => {
    setIsopen(true);
  }, []);
  return handleConfirm ? (
    <Container>
      <ButtonConfirm>
        <Collapse in={isOpen}>
          <MainButton
            text={""}
            icon={<DoneIcon />}
            handleClick={handleConfirm}
          />
        </Collapse>
      </ButtonConfirm>
    </Container>
  ) : (
    <></>
  );
};

const Container = styled.div`
  position: relative;
  height: 36px;
`;
const ButtonConfirm = styled.div`
  width: calc(100%);
  display: flex;
  position: fixed;
  bottom: 0px;
  left: 0;
  & button {
    height: 36px;
    width: 100%;
    /* border-radius: 8px 8px 0 0; */
  }
  & .MuiCollapse-root {
    width: 100%;
  }
`;
