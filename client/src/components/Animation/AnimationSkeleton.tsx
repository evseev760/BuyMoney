import Skeleton from "@mui/material/Skeleton";

export const AnimationSkeleton = () => {
  return (
    <div style={{ paddingTop: "20px", height: "100px", minHeight: "100px" }}>
      <Skeleton variant="circular" width={80} height={80} />
    </div>
  );
};
