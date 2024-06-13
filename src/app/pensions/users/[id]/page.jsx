import UserRoleTable from "@/components/pensionsComponents/Roles/UserRoleTable";
import RecordCard from "@/components/pensionsComponents/recordCard/RecordCard";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import React from "react";

const User = () => {
  return (
    <div>
      <div>
        <div className="pl-3 mt-5">
          <h2 className="mb-2 text-lg text-primary font-semibold ">Users</h2>

          <Breadcrumbs aria-label="breadcrumb">
            <h5 className="font-semibold">User Details</h5>
            <h5 className="font-medium text-sm text-black">Xavier Sisse</h5>
          </Breadcrumbs>
        </div>

        <RecordCard />
      </div>
    </div>
  );
};

export default User;
