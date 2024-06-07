import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTg } from "hooks/useTg";
import styled from "styled-components";

interface SwipeableListItemProps {
  children: React.ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
}

const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  children,
  onClick,
  isDisabled,
}) => {
  const defaultPosition = 0;
  const maxSwipeDistance = 56;
  const { themeParams } = useTg();
  const [translateX, setTranslateX] = useState(defaultPosition);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlers = useSwipeable(
    !isDisabled
      ? {
          onSwiping: (eventData) => {
            if (eventData.dir === "Left") {
              const deltaX = eventData.absX;
              if (deltaX <= maxSwipeDistance) {
                setTranslateX(-deltaX);
              }
            } else if (eventData.dir === "Right") {
              setTranslateX(defaultPosition);
            }
          },
          onSwiped: (eventData) => {
            if (
              eventData.dir === "Left" &&
              eventData.absX > maxSwipeDistance - 1
            ) {
              setTranslateX(-maxSwipeDistance);
            } else {
              setTranslateX(defaultPosition);
            }
          },
        }
      : {}
  );

  const handleClickOutside = useCallback(
    (event: TouchEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setTranslateX(defaultPosition);
      }
    },
    [componentRef]
  );

  useEffect(() => {
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Container
      ref={componentRef}
      themeParams={themeParams}
      translateX={translateX}
    >
      <DeleteIcon
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          height: "100%",
          padding: "16px",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        onClick={onClick}
      />
      <SwipeableContent
        {...handlers}
        translateX={translateX}
        onClick={() => setTranslateX(defaultPosition)}
      >
        {children}
      </SwipeableContent>
    </Container>
  );
};
interface ContainerProps {
  themeParams: any;
  translateX: number;
}

interface SwipeableContentProps {
  translateX: number;
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  background: ${({ translateX, themeParams }) =>
    translateX ? themeParams.destructive_text_color : "rgba(0,0,0,0)"};
  position: relative;
  transition: background-color 0.3s;
`;

const SwipeableContent = styled.div<SwipeableContentProps>`
  width: 100%;
  transform: translateX(${({ translateX }) => translateX}px);
  transition: transform 0.3s;
`;

export default SwipeableListItem;
