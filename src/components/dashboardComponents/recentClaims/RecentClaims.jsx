import { Box, Typography } from "@mui/material";
import React from "react";
import RecentClaimsTable from "./RecentClaimsTable";

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
