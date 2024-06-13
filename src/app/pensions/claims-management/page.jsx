import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Spinner from "@/components/spinner/Spinner";
import { Box, Button, Typography } from "@mui/material";

const ClaimsTable = dynamic(
  () =>
    import("@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable"),
  {
    suspense: true,
  }
);

function ClaimsManagement() {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <div className="flex items-center justify-between mr-2 mt-4">
          <div className="flex pl-2 flex-col mb-2 gap-2">
            <h3 className="text-primary text-xl font-semibold ml-3">Claims</h3>
          </div>
        </div>

        <div className="h-[100vh] w-[100%]">
          <ClaimsTable />
        </div>
      </Suspense>
    </div>
  );
}

export default ClaimsManagement;
