import { OfferViewSkeleton } from "components/OfferView/Skeleton";
import React, { Suspense } from "react";
const MyDealsWrapped = React.lazy(() => import("./MyDealsSrc"));

export interface MyDealsProps {
  offerId?: string;
  title?: string;
}
export const MyDeals = (props: MyDealsProps) => {
  return (
    <Suspense fallback={<OfferViewSkeleton />}>
      <MyDealsWrapped {...props} />
    </Suspense>
  );
};
