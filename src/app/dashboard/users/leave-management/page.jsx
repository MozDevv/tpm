"use client";
import AddLeaveDrawer from "@/components/LeaveManagement/AddLeaveDrawer";
import Spinner from "@/components/spinner/Spinner";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Suspense, useState } from "react";

// Dynamically import the LeaveManagementTable component
const LeaveManagementTable = dynamic(
  () => import("@/components/LeaveManagement/LeaveManagementTable"),
  {
    suspense: true,
  }
);

function LeaveManagement() {
  const [openAddLeave, setOpenAddLeave] = useState(false);
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <LeaveManagementTable setOpenAddLeave={setOpenAddLeave} />
        <AddLeaveDrawer
          openAddLeave={openAddLeave}
          setOpenAddLeave={setOpenAddLeave}
        />
      </Suspense>
    </div>
  );
}

export default LeaveManagement;
