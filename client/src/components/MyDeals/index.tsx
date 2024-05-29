import { OfferViewSkeleton } from "components/OfferView/Skeleton";
import React, { Suspense } from "react";
const MyDealsWrapped = React.lazy(() => import("./MyDealsSrc"));

export const MyDeals = () => {
  return (
    <Suspense fallback={<OfferViewSkeleton />}>
      <MyDealsWrapped />
    </Suspense>
  );
};
