import Spinner from "@/components/spinner/Spinner";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const ClaimsApprovalTable = dynamic(
  () =>
    import(
      "@/components/pensionsComponents/ClaimsApprovalComponents/ClaimsApprovalTable"
    ),
  {
    suspense: true,
  }
);

function ClaimsApproval() {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <ClaimsApprovalTable />
      </Suspense>
    </div>
  );
}

export default ClaimsApproval;
