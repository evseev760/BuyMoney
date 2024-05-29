import React, { Suspense } from "react";
import { AnimationSkeleton } from "./AnimationSkeleton";
// import { AnimationProps, Animation } from "./animationSrc";
const AnimationWrapped = React.lazy(() => import("./animationSrc"));

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
export const Animation = (props: AnimationProps) => {
  return (
    <Suspense fallback={<AnimationSkeleton />}>
      <AnimationWrapped {...props} />
    </Suspense>
  );
};
