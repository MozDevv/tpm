import { Box, Breadcrumbs, Typography } from "@mui/material";
import React from "react";

const User = () => {
  return (
    <div>
      {" "}
      <Box>
        <Typography variant="h3" mb={1}>
          Users
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography fontWeight={600} variant="h6">
            User Details
          </Typography>
          <Typography color="text.primary">John Doe</Typography>
        </Breadcrumbs>
      </Box>
    </div>
  );
};

export default User;
