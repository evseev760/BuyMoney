import React from "react";
import Lottie from "lottie-react";
import welcome from "./welcome.json";
import money from "./money.json";
import sleep from "./sleep.json";

export enum Animations {
  WELCOME = "WELCOME",
  MONEY = "MONEY",
  SLEEP = "SLEEP",
}
interface AnimationProps {
  type: Animations;
  size?: number;
}

export const Animation = ({ type, size }: AnimationProps) => {
  const animations = {
    [Animations.MONEY]: money,
    [Animations.WELCOME]: welcome,
    [Animations.SLEEP]: sleep,
  };
  return (
    <>
      <Lottie
        animationData={animations[type]}
        loop={true}
        style={{
          height: `${size ? size : 100}px`,
          width: `${size ? size : 100}px`,
        }}
      />
    </>
  );
};

// export default Animation;
