import Dashboard from "@/components/financeComponents/dashboardComponents/Dashboard";
import ApprovalRequest from "@/components/financeComponents/dashboardComponents/approvalRequests/ApprovalRequest";
import PendingApproval from "@/components/financeComponents/dashboardComponents/pendingapproval/PendingApproval";
import { Divider, Grid, Typography } from "@mui/material";
import React from "react";

function Overview() {
  return (
    <div>
      <Dashboard />
      <Grid container spacing={1} mt={2} p={1}>
        <Grid item xs={6.5} sx={{ height: "400px" }}>
          <PendingApproval />
        </Grid>

        <Grid item xs={5.5} sx={{ height: "400px" }}>
          <p className="mb-1 mt-3 text-base font-bold text-primary">
            Approval Requests
          </p>
          <ApprovalRequest />
        </Grid>
      </Grid>
    </div>
  );
}

export default Overview;
