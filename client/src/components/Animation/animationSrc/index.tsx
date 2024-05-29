import Lottie from "lottie-react";
// import welcome from "./animationSrc/welcome.json";
// import money from "./animationSrc/money.json";
// import sleep from "./animationSrc/sleep.json";
// import suspicion from "./animationSrc/suspicion.json";
import hello from "./hello.json";
import oh from "./oh.json";

export enum Animations {
  // WELCOME = "WELCOME",
  // MONEY = "MONEY",
  // SLEEP = "SLEEP",
  // SUSPICION = "SUSPICION",
  HELLO = "HELLO",
  OH = "OH",
}
interface AnimationProps {
  type: Animations;
  size?: number;
}

export const AnimationWrapped = ({ type, size }: AnimationProps) => {
  const animations = {
    // [Animations.MONEY]: money,
    // [Animations.WELCOME]: welcome,
    // [Animations.SLEEP]: sleep,
    // [Animations.SUSPICION]: suspicion,
    [Animations.HELLO]: hello,
    [Animations.OH]: oh,
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

export default AnimationWrapped;
