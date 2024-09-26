"use client";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Spinner from "@/components/spinner/Spinner";
import { Box, Button, Typography } from "@mui/material";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import Claims from "@/components/pensionsComponents/preclaims/Claims";
import ClaimsTable from "@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable";

function page() {
  return (
    <div>
      <React.Suspense fallback={<Spinner />}>
        <div className="ml-4">
          <div className="text-primary mt-5 ml-3 mb-3 font-semibold text-xl">
            Claims Verification
          </div>
          <CustomBreadcrumbsList currentTitle="Claims Verification" />
        </div>
        <ClaimsTable status={0} />
      </React.Suspense>
    </div>
  );
}

export default page;
