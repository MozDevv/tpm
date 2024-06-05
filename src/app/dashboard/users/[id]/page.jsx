import UserRoleTable from "@/components/Roles/UserRoleTable";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
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
          <Typography fontWeight={600} variant="h5">
            User Details
          </Typography>
          <Typography color="text.primary">John Doe</Typography>
        </Breadcrumbs>

        <Grid container spacing={2} mt={4}>
          <Grid
            item
            xs={3}
            sx={{ backgroundColor: "white", maxHeight: "100%" }}
          ></Grid>
          <Grid item xs={8.5}>
            <UserRoleTable />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default User;
