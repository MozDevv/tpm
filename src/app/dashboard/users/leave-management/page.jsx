import Spinner from "@/components/spinner/Spinner";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Suspense } from "react";

// Dynamically import the LeaveManagementTable component
const LeaveManagementTable = dynamic(
  () => import("@/components/LeaveManagement/LeaveManagementTable"),
  {
    suspense: true,
  }
);

function LeaveManagement() {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <LeaveManagementTable />
      </Suspense>
    </div>
  );
}

export default LeaveManagement;
