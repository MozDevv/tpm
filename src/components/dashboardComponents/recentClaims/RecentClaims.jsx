import { Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
const RecentClaimsTable = dynamic(() => import("./RecentClaimsTable"));

function RecentClaims() {
  return (
    <div>
      <Box sx={{ p: 2 }}>
        <RecentClaimsTable />
      </Box>
    </div>
  );
}

export default RecentClaims;
