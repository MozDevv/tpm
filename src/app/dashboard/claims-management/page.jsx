import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Spinner from "@/components/spinner/Spinner";

const ClaimsTable = dynamic(
  () => import("@/components/ClaimsManagementTable/ClaimsTable"),
  {
    suspense: true,
  }
);

function ClaimsManagement() {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <ClaimsTable />
      </Suspense>
    </div>
  );
}

export default ClaimsManagement;
