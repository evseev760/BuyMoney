import Skeleton from "@mui/material/Skeleton";

export const AnimationSkeleton = () => {
  return (
    <div style={{ marginTop: "20px" }}>
      <Skeleton variant="circular" width={80} height={80} />
    </div>
  );
};
