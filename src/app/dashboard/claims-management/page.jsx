import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Spinner from "@/components/spinner/Spinner";
import { Box, Button, Typography } from "@mui/material";

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mr: 6,
          }}
        >
          <Box
            sx={{
              display: "flex",
              pl: 2,
              mb: 1,
              gap: "10px",
              flexDirection: "column",
            }}
          >
            <Typography variant="h2">Claims</Typography>
            <Typography variant="h6" fontSize={13} color="GrayText">
              Claims Listing
            </Typography>
          </Box>
          <Box>
            <Button variant="contained">Add New</Button>
          </Box>
        </Box>
        <div style={{ height: "100vh", width: "100%" }}>
          <ClaimsTable />
        </div>
      </Suspense>
    </div>
  );
}

export default ClaimsManagement;
